# Leads API

REST API para gestión de leads comerciales construida con **NestJS**, **Arquitectura Hexagonal** y **CQRS**, usando **PostgreSQL** como base de datos.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5.7 |
| Base de datos | PostgreSQL |
| ORM | TypeORM 0.3 |
| Patrón | Arquitectura Hexagonal + CQRS |
| Validación | class-validator / class-transformer |

---

## Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)** con separación en tres capas:

```
Domain        → Entidades, Value Objects, Eventos, Puertos (interfaces)
Application   → Commands, Queries, Handlers, DTOs
Infrastructure → TypeORM, Controller HTTP, Mapper
```

### Flujo CQRS

```
HTTP Request
    │
    ▼
LeadsController (infrastructure)
    │
    ├── CommandBus ──► CreateLeadCommand ──► CreateLeadHandler
    │                  UpdateLeadCommand ──► UpdateLeadHandler
    │
    └── QueryBus ───► FindAllLeadsQuery  ──► FindAllLeadsHandler
                      FindLeadByIdQuery  ──► FindLeadByIdHandler
                      GetLeadStatsQuery  ──► GetLeadStatsHandler
```

---

## Requisitos

- Node.js >= 20
- npm >= 10
- PostgreSQL >= 14

---

## Instalación

```bash
npm install
```

---

## Variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto | `5432` |
| `DB_USER` | Usuario | `postgres` |
| `DB_PASSWORD` | Contraseña | `root` |
| `DB_NAME` | Nombre de la base de datos | `leads_db` |
| `DB_SYNC` | Sincronizar schema automáticamente (solo dev) | `false` |
| `DB_LOGGING` | Log de queries SQL | `false` |

> Crea la base de datos en PostgreSQL antes de correr la migración:
> ```sql
> CREATE DATABASE leads_db;
> ```

---

## Base de datos

### Ejecutar migración

Crea la tabla `leads` con todos sus campos:

```bash
npm run migration:run
```

### Revertir migración

```bash
npm run migration:revert
```

### Generar nueva migración

```bash
npm run migration:generate -- src/database/migrations/NombreDeCambio
```

### Cargar datos de prueba (seed)

Inserta 12 leads de ejemplo con distintas fuentes y presupuestos:

```bash
npm run seed
```

---

## Ejecutar el proyecto

```bash
# Desarrollo con watch
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor arranca en `http://localhost:3000`. Todas las rutas tienen el prefijo `/api/v1`.

---

## Endpoints

Base URL: `http://localhost:3000/api/v1` or Documented at [Postman](https://documenter.getpostman.com/view/2573907/2sBXqFNhgM)

### Crear lead

```
POST /leads
```

**Body:**
```json
{
  "name": "Juan García",
  "email": "juan@empresa.com",
  "phone": "+57 300 111 2233",
  "source": "website",
  "productInterest": "Software ERP",
  "budget": 5000
}
```

**Respuesta `201`:**
```json
{ "id": "uuid-generado" }
```

---

### Listar leads

```
GET /leads
```

Retorna todos los leads con estado `ACTIVE`.

**Respuesta `200`:**
```json
[
  {
    "id": "...",
    "name": "Juan García",
    "email": "juan@empresa.com",
    "phone": "+57 300 111 2233",
    "source": "website",
    "productInterest": "Software ERP",
    "budget": 5000,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Obtener lead por ID

```
GET /leads/:id
```

**Respuesta `200`:** mismo objeto de lead.

Lanza `404` si el lead no existe.

---

### Actualizar lead (PATCH parcial)

```
PATCH /leads/:id
```

**Body** (todos los campos son opcionales):
```json
{
  "name": "Juan García López",
  "budget": 8000
}
```

**Respuesta `200`:** sin cuerpo.

---

### Estadísticas

```
GET /leads/stats
```

**Respuesta `200`:**
```json
{
  "totalLeads": 12,
  "leadsBySource": [
    { "source": "website", "count": 3 },
    { "source": "referral", "count": 2 },
    { "source": "social_media", "count": 2 },
    { "source": "email_campaign", "count": 2 },
    { "source": "cold_call", "count": 2 },
    { "source": "event", "count": 1 }
  ],
  "averageBudget": 6958.33,
  "lastSevenDaysLeads": 12
}
```

---

## Estructura del proyecto

```
src/
├── app.module.ts
├── main.ts
├── database/
│   ├── data-source.ts          ← DataSource para CLI de TypeORM
│   ├── migrations/
│   │   └── 1700000000000-CreateLeadsTable.ts
│   └── seeds/
│       └── lead.seed.ts
├── modules/
│   └── leads/
│       ├── leads.module.ts
│       ├── domain/
│       │   ├── entities/
│       │   │   └── lead.entity.ts          ← Aggregate Root
│       │   ├── events/
│       │   │   └── lead-create.event.ts
│       │   ├── exceptions/
│       │   │   └── lead.exceptions.ts
│       │   ├── ports/
│       │   │   └── lead.repository.ts      ← Puerto (interfaz)
│       │   └── value-objects/
│       │       ├── email.value-object.ts
│       │       └── name.value-object.ts
│       ├── applications/
│       │   ├── commands/
│       │   │   ├── create-lead/            ← Command + Handler
│       │   │   └── update-lead/            ← Command + Handler
│       │   ├── dtos/
│       │   │   ├── create-lead.dto.ts
│       │   │   ├── update-lead.dto.ts
│       │   │   ├── lead-response.dto.ts
│       │   │   └── lead-stats-response.dto.ts
│       │   ├── events/
│       │   │   └── lead-created/           ← Event Handler
│       │   └── queries/
│       │       ├── find-all-leads/         ← Query + Handler
│       │       ├── find-lead-by-id/        ← Query + Handler
│       │       └── get-lead-stats/         ← Query + Handler
│       └── infrastructure/
│           ├── http/
│           │   └── users.controller.ts     ← LeadsController
│           └── persistence/
│               ├── lead.mapper.ts          ← Domain ↔ ORM
│               └── typeorm/
│                   ├── lead.typeorm-entity.ts
│                   └── lead.typeorm-repo.ts ← Implementación del puerto
└── shared/
    ├── domain/
    │   ├── aggregate-root.ts
    │   ├── domain-event.ts
    │   └── value-object.ts
    ├── infrastructure/
    │   └── database.module.ts
    └── value-objects/
        └── uuid.value-object.ts
```

---

## Tests

```bash
# Unit tests
npm run test

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```

---

## Decisiones de diseño

**Value Objects**: `Name` y `Email` encapsulan validaciones de dominio. `Name` almacena internamente `{ name: string }` para soportar nombres compuestos a futuro. `Email` normaliza a minúsculas en creación.

**CQRS sin Event Sourcing**: Se usa `CommandBus` y `QueryBus` de `@nestjs/cqrs` para separar escrituras y lecturas, sin event sourcing completo.

**Soft delete**: Los leads no se eliminan físicamente. El campo `is_active` puede ser `ACTIVE`, `INACTIVE` o `DELETED`. El método `delete()` en la entidad cambia el estado a `DELETED`.

**Migrations vs synchronize**: `synchronize: false` en producción. Las migraciones se versionan en `src/database/migrations/` y se ejecutan manualmente con `npm run migration:run`.


---

### AI Summary

```
POST /leads/ai/summary
```
**Nota**: Para este endpoint es necesario tener una clave de API de Anthropic en el entorno. Pero no cuento con una clave para que no se haga un commit y ponerla a prueba.

Por lo tanto solo hize el codigo basado en documentación encontrada con el fin de validar que se devuelve un mock de validación retornado por el servicio de Anthropic.

**Body:**
```json
{
  "source": "website",
  "fromDate": "2024-01-01",
  "toDate": "2024-12-31"
}
```

**Respuesta `200`:**
```json
{
  "totalLeads": 12,
  "leadsBySource": [
    { "source": "website", "count": 3 },
    { "source": "referral", "count": 2 },
    { "source": "social_media", "count": 2 },
    { "source": "email_campaign", "count": 2 },
    { "source": "cold_call", "count": 2 },
    { "source": "event", "count": 1 }
  ],
  "averageBudget": 6958.33,
  "lastSevenDaysLeads": 12
}
```

---