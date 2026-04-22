import { Lead } from '../entities/lead.entity';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';
import { Email } from '../value-objects/email.value-object';

export interface LeadRepository {
  findById(id: UuidValueObject): Promise<Lead | null>;
  findAll({ where }: { where: { status: string } }): Promise<Lead[]>;
  save(lead: Lead): Promise<Lead>;
  update(lead: Lead): Promise<Lead>;
  delete(id: UuidValueObject): Promise<void>;
  stats(): Promise<any>;
  findByEmail(email: Email): Promise<boolean>;
}

export const LeadRepository = Symbol('LeadRepository');