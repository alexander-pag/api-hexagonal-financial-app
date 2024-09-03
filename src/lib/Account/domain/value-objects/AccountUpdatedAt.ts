import { AccountUpdatedAtValidationError } from '../errors/AccountdUpdatedAtValidationError';

export class AccountUpdatedAt {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidUpdatedAt();
  }

  private ensureIsValidUpdatedAt() {
    if (!this.value) {
      throw new AccountUpdatedAtValidationError(
        'Account created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new AccountUpdatedAtValidationError(
        'Account created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new AccountUpdatedAtValidationError(
        'Account created at cannot be in future',
      );
    }
  }
}
