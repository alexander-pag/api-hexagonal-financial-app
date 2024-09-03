import { TransactionIdValidationError } from '../errors/TransactionIdValidationError';

export class TransactionId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidId();
  }

  private ensureIsValidId() {
    if (!this.value) {
      throw new TransactionIdValidationError(
        'Transaction id cannot bet empty.',
      );
    }
  }
}
