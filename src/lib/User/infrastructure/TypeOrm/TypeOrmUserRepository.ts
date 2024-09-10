import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/entity/User';
import { UserRepository } from '../../domain/repository/UserRepository';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserId } from '../../domain/value-objects/UserId';
import { TypeOrmUserEntity } from './TypeOrmUserEntity';
import { Repository } from 'typeorm';
import { UserCreatedAt } from '../../domain/value-objects/UserCreatedAt';
import { UserUpdatedAt } from '../../domain/value-objects/UserUpdatedAt';
import { TypeOrmUserMapper } from './TypeOrmUserMapper';

export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly userRepository: Repository<TypeOrmUserEntity>,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(TypeOrmUserMapper.toDomain);
  }

  async getOneById(userId: UserId): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId.value,
      },
    });

    return user ? TypeOrmUserMapper.toDomain(user) : null;
  }

  async getOneByEmail(userEmail: UserEmail): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: userEmail.value,
      },
    });

    return user ? TypeOrmUserMapper.toDomain(user) : null;
  }

  async create(user: User): Promise<void> {
    const newUserEntity = TypeOrmUserMapper.toEntity(user);
    await this.userRepository.save(newUserEntity);

    user.id = new UserId(newUserEntity.id);
    user.created_at = new UserCreatedAt(newUserEntity.created_at);
    user.updated_at = new UserUpdatedAt(newUserEntity.updated_at);
  }

  async edit(user: User): Promise<void> {
    const updatedUserEntity = TypeOrmUserMapper.toEntity(user);
    await this.userRepository.save(updatedUserEntity);
  }

  async delete(userId: UserId): Promise<void> {
    await this.userRepository.delete(userId.value);
  }
}
