import 'reflect-metadata';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import dataSource from '../../database/data-source';
import { LeadTypeOrmEntity } from '../../modules/leads/infrastructure/persistence/typeorm/lead.typeorm-entity';

config();

const leadsData = [
  { name: 'Juan García', email: 'juan.garcia@example.com', phone: '+57 300 111 2233', source: 'website', productInterest: 'Software ERP', budget: 5000 },
  { name: 'María López', email: 'maria.lopez@example.com', phone: '+57 311 222 3344', source: 'referral', productInterest: 'Hardware Servidores', budget: 8000 },
  { name: 'Carlos Martínez', email: 'carlos.martinez@example.com', phone: '+57 322 333 4455', source: 'social_media', productInterest: 'Software CRM', budget: 3000 },
  { name: 'Ana Rodríguez', email: 'ana.rodriguez@example.com', phone: '+57 333 444 5566', source: 'email_campaign', productInterest: 'Consultoría IT', budget: 12000 },
  { name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com', phone: '+57 344 555 6677', source: 'cold_call', productInterest: 'Hardware Workstations', budget: 2500 },
  { name: 'Laura Hernández', email: 'laura.hernandez@example.com', phone: '+57 355 666 7788', source: 'website', productInterest: 'Software ERP', budget: 7500 },
  { name: 'Diego Torres', email: 'diego.torres@example.com', phone: '+57 366 777 8899', source: 'event', productInterest: 'Consultoría Digital', budget: 15000 },
  { name: 'Isabella Morales', email: 'isabella.morales@example.com', phone: '+57 377 888 9900', source: 'referral', productInterest: 'Software BI', budget: 6000 },
  { name: 'Andrés Gómez', email: 'andres.gomez@example.com', phone: '+57 388 999 0011', source: 'social_media', productInterest: 'Hardware Redes', budget: 4000 },
  { name: 'Valentina Díaz', email: 'valentina.diaz@example.com', phone: '+57 399 000 1122', source: 'email_campaign', productInterest: 'Soporte IT', budget: 9000 },
  { name: 'Roberto Flores', email: 'roberto.flores@example.com', phone: '+57 310 111 2234', source: 'website', productInterest: 'Software ERP', budget: 11000 },
  { name: 'Camila Vargas', email: 'camila.vargas@example.com', phone: '+57 321 222 3346', source: 'cold_call', productInterest: 'Hardware Laptops', budget: 3500 },
];

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(LeadTypeOrmEntity);

  for (const data of leadsData) {
    const exists = await repo.findOne({ where: { email: data.email } });
    if (exists) {
      console.log(`- Ya existe: ${data.name}`);
      continue;
    }
    const entity = repo.create({ id: uuidv4(), isActive: 'ACTIVE', ...data });
    await repo.save(entity);
    console.log(`Creado: ${data.name}`);
  }

  await dataSource.destroy();
  console.log('\nSeed finalizado.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
