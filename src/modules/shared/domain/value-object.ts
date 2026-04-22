// Principio SOLID aplicado: Single Responsibility Principle
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) return false;
    if (other.constructor !== this.constructor) return false;

    return JSON.stringify(this._value) === JSON.stringify(other._value);
  }

  get value(): T {
    return this._value;
  }

}