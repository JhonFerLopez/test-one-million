import { AggregateRoot } from '../../../../shared/domain/aggregate-root';
import { UuidValueObject } from '../../../../shared/value-objects/uuid.value-object';
import { Name } from '../value-objects/name.value-object';
import { Email } from '../value-objects/email.value-object';
import { CreateLeadProps } from '../interfaces/create-lead-props.interface';
import { LeadCreateEvent } from '../events/lead-create.event';

export enum LeadStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
export interface LeadProps {
  id: UuidValueObject;
  name: Name;
  email: Email;
  phone: string;
  source: string;
  productInterest: string;
  budget: number;
  isActive: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Lead extends AggregateRoot {
  private readonly _id: UuidValueObject;
  _name: Name;
  _email: Email; 
  _phone: string;
  _source: string;
  _productInterest: string;
  _budget: number;
  _isActive: LeadStatus;
  readonly _createdAt: Date;
  _updatedAt: Date;

  constructor(private readonly props: LeadProps) {
    super();
    this._id = props.id ?? new UuidValueObject();
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone ?? '';
    this._source = props.source;
    this._productInterest = props.productInterest ?? '';
    this._budget = props.budget ?? 0;
    this._isActive = LeadStatus.ACTIVE;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }
  
  public static create(props: CreateLeadProps): Lead {
    const lead = new Lead({
      id: new UuidValueObject(),
      name: Name.create(props.name),
      email: Email.create(props.email),
      phone: props.phone ?? '',
      source: props.source,
      productInterest: props.productInterest ?? '',
      budget: props.budget ?? 0,
      isActive: LeadStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    lead.addDomainEvent(new LeadCreateEvent(lead.id.value));
    return lead;
  }

  public static reconstitute(props: LeadProps): Lead {
    return new Lead(props);
  }

  public updatePath(props: Partial<LeadProps>): Lead {
    if (props.name !== undefined)
      this._name = this._name.equals(props.name) ? this._name : props.name;

    if (props.email !== undefined)
      this._email = this._email.equals(props.email) ? this._email : props.email;

    if (props.phone !== undefined && props.phone !== this._phone)
      this._phone = props.phone;

    if (props.source !== undefined && props.source !== this._source)
      this._source = props.source;

    if (props.productInterest !== undefined && props.productInterest !== this._productInterest)
      this._productInterest = props.productInterest;

    if (props.budget !== undefined && props.budget !== this._budget)
      this._budget = props.budget;

    this._updatedAt = new Date();
    return this;
  }

  public delete(): Lead {
    this._isActive = LeadStatus.DELETED;
    return this;
  }

  // Getters
  get id() { return this._id; }
  get name() { return this._name; }
  get email() { return this._email; }
  get phone() { return this._phone; }
  get source() { return this._source; }
  get productInterest() { return this._productInterest; }
  get budget() { return this._budget; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
} 
