import { AccountIdValidationError } from '../errors/AccountIdValidationError';

export class AccountId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidId();
  }

  private ensureIsValidId() {
    if (!this.value) {
      throw new AccountIdValidationError('Account id cannot bet empty.');
    }
  }
}
