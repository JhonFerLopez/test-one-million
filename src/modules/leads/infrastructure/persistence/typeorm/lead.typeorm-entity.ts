import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('leads')
export class LeadTypeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  phone!: string;

  @Column({ type: 'varchar', length: 100 })
  source!: string;

  @Column({ type: 'varchar', length: 200, name: 'product_interest', default: '' })
  productInterest!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value !== null ? parseFloat(value) : 0),
    },
  })
  budget!: number;

  @Column({ type: 'varchar', length: 20, name: 'is_active', default: 'ACTIVE' })
  isActive!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
