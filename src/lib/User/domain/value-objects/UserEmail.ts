import { UserEmailValidationError } from '../errors/UserEmailValidationError';

export class UserEmail {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidEmail();
  }

  private ensureIsValidEmail() {
    if (!this.value) {
      throw new UserEmailValidationError('User email cannot be empty.');
    }
    if (this.value.length > 100) {
      throw new UserEmailValidationError(
        'User email cannot be more than 100 characters long.',
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new UserEmailValidationError('User email is not valid.');
    }
  }
}
