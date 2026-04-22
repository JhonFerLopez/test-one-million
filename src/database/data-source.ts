import { DataSource, DataSourceOptions } from 'typeorm';
import { LeadTypeOrmEntity } from '../modules/leads/infrastructure/persistence/typeorm/lead.typeorm-entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'leads_db',
  entities: [LeadTypeOrmEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
