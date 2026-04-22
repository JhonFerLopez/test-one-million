import { ValueObject } from '../../../../shared/domain/value-object';

interface NameProps {
  name: string;
}

export class Name extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  public static create(name: string): Name {
    const trimmedName = name?.trim();

    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (trimmedName.length > 100) {
      throw new Error('Las partes con nombre no pueden superar los 100 caracteres');
    }

    return new Name({
      name: trimmedName,
    });
  }

  get name(): string {
    return this._value.name;
  }

  public toString(): string {
    return this._value.name;
  }
}