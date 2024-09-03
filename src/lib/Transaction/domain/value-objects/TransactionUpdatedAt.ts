import { TransactionAmountValidationError } from '../errors/TransactionAmountValidationError';

export class TransactionUpdatedAt {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidUpdatedAt();
  }

  private ensureIsValidUpdatedAt() {
    if (!this.value) {
      throw new TransactionAmountValidationError(
        'Transaction created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new TransactionAmountValidationError(
        'Transaction created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new TransactionAmountValidationError(
        'Transaction created at cannot be in future',
      );
    }
  }
}
