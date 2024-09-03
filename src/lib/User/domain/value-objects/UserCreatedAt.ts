import { UserCreatedAtValidationError } from '../errors/UserCreatedAtValidationError';

export class UserCreatedAt {
  value: Date;

  constructor(value: Date, isHashed: boolean = false) {
    this.value = value;
    if (isHashed) {
      this.ensureIsValidCreatedAt();
    }
  }

  private ensureIsValidCreatedAt() {
    if (!this.value) {
      throw new UserCreatedAtValidationError(
        'User created at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new UserCreatedAtValidationError(
        'User created at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new UserCreatedAtValidationError(
        'User created at cannot be in future',
      );
    }
  }
}
