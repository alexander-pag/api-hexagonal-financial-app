import { User } from '../../domain/entity/User';
import { UserCreatedAt } from '../../domain/value-objects/UserCreatedAt';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserId } from '../../domain/value-objects/UserId';
import { UserName } from '../../domain/value-objects/UserName';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { UserUpdatedAt } from '../../domain/value-objects/UserUpdatedAt';
import { TypeOrmUserEntity } from './TypeOrmUserEntity';

export class TypeOrmUserMapper {
  static toDomain(userEntity: TypeOrmUserEntity): User {
    return new User(
      new UserName(userEntity.name),
      new UserEmail(userEntity.email),
      new UserPassword(userEntity.password, true),
      new UserCreatedAt(userEntity.created_at),
      new UserUpdatedAt(userEntity.updated_at),
      new UserId(userEntity.id),
    );
  }

  static toEntity(user: User): TypeOrmUserEntity {
    const userEntity = new TypeOrmUserEntity();

    userEntity.id = user.id?.value;
    userEntity.name = user.name.value;
    userEntity.email = user.email.value;
    userEntity.password = user.password.value;
    userEntity.created_at = user.created_at?.value || new Date();
    userEntity.updated_at = user.updated_at?.value || new Date();

    return userEntity;
  }
}
