import { User } from '../../domain/entity/User';

export class UserDTO {
  id: string;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.id.value;
    this.name = user.name.value;
    this.email = user.email.value;
  }
}
