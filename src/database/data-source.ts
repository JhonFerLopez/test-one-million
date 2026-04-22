import { DataSource, DataSourceOptions } from 'typeorm';
import { LeadTypeOrmEntity } from '../modules/leads/infrastructure/persistence/typeorm/lead.typeorm-entity';

// Opciones de conexión para runtime (sin migrations — las carga autoLoadEntities)
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'leads_db',
  synchronize: false,
};

// DataSource para el CLI de TypeORM (migraciones)
const dataSource = new DataSource({
  ...dataSourceOptions,
  entities: [LeadTypeOrmEntity],
  migrations: ['src/database/migrations/*.ts'],
});

export default dataSource;
