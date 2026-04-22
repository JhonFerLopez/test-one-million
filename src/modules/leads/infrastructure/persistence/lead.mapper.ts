import { Lead, LeadStatus } from '../../domain/entities/lead.entity';
import { LeadTypeOrmEntity } from './typeorm/lead.typeorm-entity';
import { UuidValueObject } from '@shared/value-objects/uuid.value-object';
import { Name } from '../../domain/value-objects/name.value-object';
import { Email } from '../../domain/value-objects/email.value-object';

export class LeadMapper {
  static toDomain(entity: LeadTypeOrmEntity): Lead {
    return Lead.reconstitute({
      id: new UuidValueObject(entity.id),
      name: Name.create(entity.name),
      email: Email.create(entity.email),
      phone: entity.phone,
      source: entity.source,
      productInterest: entity.productInterest,
      budget: entity.budget,
      isActive: entity.isActive as LeadStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPersistence(lead: Lead): LeadTypeOrmEntity {
    const entity = new LeadTypeOrmEntity();
    entity.id = lead.id.value;
    entity.name = lead.name.name;
    entity.email = lead.email.value;
    entity.phone = lead.phone;
    entity.source = lead.source;
    entity.productInterest = lead.productInterest;
    entity.budget = lead.budget;
    entity.isActive = lead.isActive;
    return entity;
  }
}
