import { CategoryCreatedAtValidationError } from '../errors/CategoryCreatedAtValidationError';

export class CategoryCreatedAt {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidCreatedAt();
  }

  private ensureIsValidCreatedAt() {
    if (!this.value) {
      throw new CategoryCreatedAtValidationError(
        'Category created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new CategoryCreatedAtValidationError(
        'Category created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new CategoryCreatedAtValidationError(
        'Category created at cannot be in future',
      );
    }
  }
}
