import { UserRepository } from '../../domain/repository/UserRepository';
import { UserDTO } from '../dto/UserDTO';

export class UserGetAll {
  constructor(private readonly userRepository: UserRepository) {}

  async run(): Promise<UserDTO[]> {
    const users = await this.userRepository.getAll();
    return users.map((user) => new UserDTO(user));
  }
}
