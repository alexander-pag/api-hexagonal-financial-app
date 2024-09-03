import { TransactionDateValidationError } from '../errors/TransactionDateValidationError';

export class TransactionDate {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidDate();
  }

  private ensureIsValidDate() {
    if (!this.value) {
      throw new TransactionDateValidationError(
        'Transaction date at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new TransactionDateValidationError(
        'Transaction date at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new TransactionDateValidationError(
        'Transaction date at cannot be in future',
      );
    }
  }
}
