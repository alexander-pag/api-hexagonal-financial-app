export interface PasswordManagementRepository {
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
