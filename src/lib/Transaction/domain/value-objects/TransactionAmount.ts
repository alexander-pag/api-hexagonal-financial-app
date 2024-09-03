import { TransactionAmountValidationError } from '../errors/TransactionAmountValidationError';

export class TransactionAmount {
  value: number;

  constructor(value: number) {
    this.value = value;
    this.ensureIsValidAmount();
  }

  private ensureIsValidAmount() {
    if (!this.value) {
      throw new TransactionAmountValidationError(
        `Transaction amount cannot be empty.`,
      );
    }
    if (typeof this.value !== 'number' || isNaN(this.value)) {
      throw new TransactionAmountValidationError(
        'Transaction amount must be a valid number.',
      );
    }
    if (this.value < 0) {
      throw new TransactionAmountValidationError(
        'Transaction amount cannot be negative.',
      );
    }
  }
}
