import { CategoryIdValidationError } from '../errors/CategoryIdValidationError';

export class CategoryId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidId();
  }

  private ensureIsValidId() {
    if (!this.value) {
      throw new CategoryIdValidationError('Category id cannot be empty.');
    }
  }
}
