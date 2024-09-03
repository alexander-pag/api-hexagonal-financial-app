import { UserDTO } from '../dto/UserDTO';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserId } from '../../domain/value-objects/UserId';

export class UserGetOneById {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string): Promise<UserDTO> {
    const user = await this.userRepository.getOneById(new UserId(id));
    return new UserDTO(user);
  }
}
