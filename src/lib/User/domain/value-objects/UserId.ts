import { UserIdValidationError } from '../errors/UserIdValidationError';

export class UserId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidId();
  }

  private ensureIsValidId() {
    if (!this.value) {
      throw new UserIdValidationError('User id cannot be empty.');
    }
  }
}
