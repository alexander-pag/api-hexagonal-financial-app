import { AccountBalanceValidationError } from '../errors/AccountBalanceValidationError';

export class AccountBalance {
  value: number;

  constructor(value: number) {
    this.value = value;
    this.ensureIsValidBalance();
  }

  private ensureIsValidBalance() {
    if (!this.value) {
      throw new AccountBalanceValidationError(
        'Account balance cannot be empty.',
      );
    }
    if (typeof this.value !== 'number' || isNaN(this.value)) {
      throw new AccountBalanceValidationError(
        'Account balance must be a valid number.',
      );
    }
    if (this.value < 0) {
      throw new AccountBalanceValidationError(
        'Account balance cannot be negative.',
      );
    }
  }
}
