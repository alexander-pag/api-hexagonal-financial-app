import { User } from '../../domain/entity/User';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { PasswordManagementRepository } from '../../domain/repository/PasswordManagementRepository';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserId } from '../../domain/value-objects/UserId';
import { UserName } from '../../domain/value-objects/UserName';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { UserUpdatedAt } from '../../domain/value-objects/UserUpdatedAt';

export class UserEdit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordManegementPassword: PasswordManagementRepository,
  ) {}

  async run(
    id: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<void> {
    const userExists = await this.userRepository.getOneById(new UserId(id));

    let userPasswordEncrypt = userExists.password.value;
    if (password) {
      const userPassword = new UserPassword(password);
      userPasswordEncrypt =
        await this.passwordManegementPassword.encryptPassword(
          userPassword.value,
        );
    }

    if (!userExists) {
      throw new UserNotFoundError(`User with id ${id} not found.`);
    }

    const userEmail =
      email && email !== userExists.email.value
        ? await this.userRepository.getOneByEmail(new UserEmail(email))
        : null;

    if (userEmail && userEmail.email.value !== email) {
      throw new UserAlreadyExistsError(
        `User with email ${email} already exists.`,
      );
    }

    const updatedUser = new User(
      name ? new UserName(name) : userExists.name,
      email ? new UserEmail(email) : userExists.email,
      new UserPassword(userPasswordEncrypt, true),
      userExists.created_at,
      new UserUpdatedAt(new Date()),
      new UserId(id),
    );

    await this.userRepository.edit(updatedUser);
  }
}
