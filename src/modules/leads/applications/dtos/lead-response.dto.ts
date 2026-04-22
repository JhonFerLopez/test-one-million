import { Lead } from '../../domain/entities/lead.entity';


export class LeadResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  source!: string;
  productInterest!: string;
  budget!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(lead: Lead): LeadResponseDto {
    const dto = new LeadResponseDto();
    dto.id = lead.id.value;
    dto.name = lead.name.name;
    dto.email = lead.email.value;
    dto.phone = lead.phone;
    dto.source = lead.source;
    dto.productInterest = lead.productInterest;
    dto.budget = lead.budget;
    dto.createdAt = lead.createdAt;
    dto.updatedAt = lead.updatedAt;
    return dto;
  }
}
