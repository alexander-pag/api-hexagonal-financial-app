import { UserRepository } from '../../domain/repository/UserRepository';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserDTO } from '../dto/UserDTO';

export class UserGetOneByEmail {
  constructor(private readonly userRepository: UserRepository) {}

  async run(email: string): Promise<UserDTO> {
    const user = await this.userRepository.getOneByEmail(new UserEmail(email));
    return new UserDTO(user);
  }
}
