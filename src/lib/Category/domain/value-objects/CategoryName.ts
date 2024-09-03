import { CategoryNameValidationError } from '../errors/CategoryNameValidationError';

export class CategoryName {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidName();
  }

  private ensureIsValidName() {
    if (!this.value) {
      throw new CategoryNameValidationError('Category name cannot be empty.');
    }
    if (this.value.length < 3) {
      throw new CategoryNameValidationError(
        'Category name must be at least 3 characters long.',
      );
    }
    if (this.value.length > 50) {
      throw new CategoryNameValidationError(
        'Category name cannot be more than 50 characters long.',
      );
    }
    if (!/^[a-zA-Z\s]+$/.test(this.value)) {
      throw new CategoryNameValidationError(
        'Category name can only contain letters and spaces.',
      );
    }
  }
}
