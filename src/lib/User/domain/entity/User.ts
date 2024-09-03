import { UserCreatedAt } from '../value-objects/UserCreatedAt';
import { UserEmail } from '../value-objects/UserEmail';
import { UserId } from '../value-objects/UserId';
import { UserName } from '../value-objects/UserName';
import { UserPassword } from '../value-objects/UserPassword';
import { UserUpdatedAt } from '../value-objects/UserUpdatedAt';

export class User {
  id: UserId;
  name: UserName;
  email: UserEmail;
  password: UserPassword;
  created_at: UserCreatedAt;
  updated_at: UserUpdatedAt;

  constructor(
    name: UserName,
    email: UserEmail,
    password: UserPassword,
    created_at?: UserCreatedAt,
    updated_at?: UserUpdatedAt,
    id?: UserId,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
