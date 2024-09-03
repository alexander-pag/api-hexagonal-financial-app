import { UserUpdatedAtValidationError } from '../errors/UserUpdatedAtValidationError';

export class UserUpdatedAt {
  value: Date;

  constructor(value: Date, isHashed: boolean = false) {
    this.value = value;
    if (isHashed) {
      this.ensureIsValidUpdatedAt();
    }
  }

  private ensureIsValidUpdatedAt() {
    if (!this.value) {
      throw new UserUpdatedAtValidationError(
        'User updated at cannot be empty.',
      );
    }
    if (!(this.value instanceof Date) || isNaN(this.value.getTime())) {
      throw new UserUpdatedAtValidationError(
        'User updated at is not valid date',
      );
    }
    if (this.value.getTime() > Date.now()) {
      throw new UserUpdatedAtValidationError(
        'User updated at cannot be in future',
      );
    }
  }
}
