export abstract class ValueObject<T> {
  public readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  isEqual(other: ValueObject<T>): boolean {
    return this.value === other.value;
  }
}
