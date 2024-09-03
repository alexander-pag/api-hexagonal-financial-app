import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserId } from '../../domain/value-objects/UserId';

export class UserDelete {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string): Promise<void> {
    const userExists = await this.userRepository.getOneById(new UserId(id));

    if (!userExists) {
      throw new UserNotFoundError(`User with id ${id} not found.`);
    }

    await this.userRepository.delete(new UserId(id));
  }
}
