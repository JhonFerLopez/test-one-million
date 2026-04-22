import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLeadsTable1700000000000 implements MigrationInterface {
  name = 'CreateLeadsTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '100', isUnique: true },
          { name: 'phone', type: 'varchar', length: '50', default: "''" },
          { name: 'source', type: 'varchar', length: '100' },
          { name: 'product_interest', type: 'varchar', length: '200', default: "''" },
          { name: 'budget', type: 'decimal', precision: 12, scale: 2, default: '0' },
          { name: 'is_active', type: 'varchar', length: '20', default: "'ACTIVE'" },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leads');
  }
}
