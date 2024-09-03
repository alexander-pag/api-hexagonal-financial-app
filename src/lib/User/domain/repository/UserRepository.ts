import { User } from '../entity/User';
import { UserEmail } from '../value-objects/UserEmail';
import { UserId } from '../value-objects/UserId';

export interface UserRepository {
  create(user: User): Promise<void>;
  getAll(): Promise<User[]>;
  getOneById(userId: UserId): Promise<User>;
  getOneByEmail(userEmail: UserEmail): Promise<User>;
  edit(user: User): Promise<void>;
  delete(userId: UserId): Promise<void>;
}
