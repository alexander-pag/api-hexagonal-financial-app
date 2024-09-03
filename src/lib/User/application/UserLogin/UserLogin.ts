import { UserInvalidCredentialsError } from '../../domain/errors/UserInvalidCredentialsError';
import { PasswordManagementRepository } from '../../domain/repository/PasswordManagementRepository';
import { TokenManagementRepository } from '../../domain/repository/TokenManagementRepository';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { UserDTO } from '../dto/UserDTO';

export class UserLogin {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordManegementPassword: PasswordManagementRepository,
    private readonly tokenManagementRepository: TokenManagementRepository,
  ) {}

  async run(
    email: string,
    password: string,
  ): Promise<{ user: UserDTO; token: string }> {
    const userExists = await this.userRepository.getOneByEmail(
      new UserEmail(email),
    );

    if (!userExists) {
      throw new UserInvalidCredentialsError('Invalid credencials.');
    }

    const receivedPassword = new UserPassword(password);

    const validatePassword =
      await this.passwordManegementPassword.validatePassword(
        receivedPassword.value,
        userExists.password.value,
      );

    if (!validatePassword) {
      throw new UserInvalidCredentialsError('Invalid credencials.');
    }

    const token = this.tokenManagementRepository.generateToken({
      userId: userExists.id.value,
      userEmail: userExists.email.value,
    });

    return { user: new UserDTO(userExists), token };
  }
}
