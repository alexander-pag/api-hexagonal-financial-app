import { TransactionDescriptionValidationError } from '../errors/TransactionDescriptionValidationError';

export class TransactionDescription {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidDescription();
  }

  private ensureIsValidDescription() {
    if (this.value && this.value.length < 10) {
      throw new TransactionDescriptionValidationError(
        'Transaction description must be at least 10 characters long.',
      );
    }
    if (this.value && this.value.length > 255) {
      throw new TransactionDescriptionValidationError(
        'Transaction description cannot be more than 255 characters long.',
      );
    }
  }
}
