import { ValueObject } from '../../../../shared/domain/value-object';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Email {
    const normalized = email.trim().toLowerCase();

    if (!normalized || normalized.length === 0) {
      throw new Error('El correo electrónico no puede estar vacío');
    }

    if (!Email.EMAIL_REGEX.test(normalized)) {
      throw new Error(`El correo electrónico no es válido: ${normalized}`);
    }

    if (normalized.length > 100) {
      throw new Error('El correo electrónico no puede superar los 100 caracteres');
    }

    return new Email({ value: normalized });
  }

  get value(): any {
    return this._value.value;
  }

  public toString(): string {
    return this._value.value;
  }
}