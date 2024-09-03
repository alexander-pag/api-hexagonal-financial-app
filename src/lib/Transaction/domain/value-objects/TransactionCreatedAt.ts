import { TransactionCreatedAtValidationError } from '../errors/TransactionCreatedAtValidationError';

export class TransactionCreatedAt {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidCreatedAt();
  }

  private ensureIsValidCreatedAt() {
    if (!this.value) {
      throw new TransactionCreatedAtValidationError(
        'Transaction created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new TransactionCreatedAtValidationError(
        'Transaction created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new TransactionCreatedAtValidationError(
        'Transaction created at cannot be in future',
      );
    }
  }
}
