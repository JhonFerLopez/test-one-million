export class LeadNotFoundException extends Error {
  constructor(message: string) {
    super(`El usuario interesado no se encuentra: ${message}`);
    this.name = 'LeadNotFoundException';
  }
}

export class LeadAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`El usuario interesado ya existe con correo electrónico: ${email}`);
    this.name = 'LeadAlreadyExistsException';
  }
}

export class InvalidLeadOperationException extends Error {
  constructor(message: string) {
    super(`La operación solicitada no es válida: ${message}`);
    this.name = 'InvalidLeadOperationException';
  }
}