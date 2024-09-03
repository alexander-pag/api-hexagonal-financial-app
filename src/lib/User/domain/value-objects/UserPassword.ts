import { UserPasswordValidationError } from '../errors/UserPasswordValidationError';

export class UserPassword {
  value: string;

  constructor(value: string, hashed: boolean = false) {
    if (!hashed) {
      this.ensureIsValidPassword(value);
    }
    this.value = value;
  }

  private ensureIsValidPassword(password: string) {
    if (!password) {
      throw new UserPasswordValidationError('User password cannot be empty.');
    }
    if (password.length < 8) {
      throw new UserPasswordValidationError(
        'User password must be at least 8 characters long.',
      );
    }
    if (password.length > 100) {
      throw new UserPasswordValidationError(
        'User password cannot be more than 100 characters long.',
      );
    }
    if (!/[A-Z]/.test(password)) {
      throw new UserPasswordValidationError(
        'User password must contain at least one uppercase letter.',
      );
    }
    if (!/[a-z]/.test(password)) {
      throw new UserPasswordValidationError(
        'User password must contain at least one lowercasse letter.',
      );
    }
    if (!/[0-9]/.test(password)) {
      throw new UserPasswordValidationError(
        'User password containt at least one number.',
      );
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new UserPasswordValidationError(
        'User password contain at least one special character.',
      );
    }
  }
}
