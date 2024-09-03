import { User } from '../../domain/entity/User';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';
import { PasswordManagementRepository } from '../../domain/repository/PasswordManagementRepository';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserCreatedAt } from '../../domain/value-objects/UserCreatedAt';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserName } from '../../domain/value-objects/UserName';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { UserUpdatedAt } from '../../domain/value-objects/UserUpdatedAt';

export class UserCreate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordManegementPassword: PasswordManagementRepository,
  ) {}

  async run(name: string, email: string, password: string): Promise<void> {
    const userExistsByEmail = await this.userRepository.getOneByEmail(
      new UserEmail(email),
    );

    if (userExistsByEmail) {
      throw new UserAlreadyExistsError(
        `User with email ${email} already exists.`,
      );
    }

    const userPassword = new UserPassword(password);
    const userPasswordEncrypt =
      await this.passwordManegementPassword.encryptPassword(userPassword.value);

    const newUser = new User(
      new UserName(name),
      new UserEmail(email),
      new UserPassword(userPasswordEncrypt, false),
      new UserCreatedAt(new Date()),
      new UserUpdatedAt(new Date()),
    );

    await this.userRepository.create(newUser);
  }
}
