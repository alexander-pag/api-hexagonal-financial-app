import { AccountCreatedAtValidationError } from '../errors/AccountCreatedAtValidationError';

export class AccountCreatedAt {
  value: Date;

  constructor(value: Date) {
    this.value = value;
    this.ensureIsValidCreatedAt();
  }

  private ensureIsValidCreatedAt() {
    if (!this.value) {
      throw new AccountCreatedAtValidationError(
        'Account created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new AccountCreatedAtValidationError(
        'Account created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new AccountCreatedAtValidationError(
        'Account created at cannot be in future',
      );
    }
  }
}
