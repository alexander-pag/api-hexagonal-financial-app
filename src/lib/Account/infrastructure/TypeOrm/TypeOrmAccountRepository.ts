import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { Account } from '../../domain/entity/Account';
import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountId } from '../../domain/value-objects/AccountId';
import { TypeOrmAccountEntity } from './TypeOrmAccountEntity';
import { AccountName } from '../../domain/value-objects/AccountName';
import { AccountBalance } from '../../domain/value-objects/AccountBalance';
import { AccountCreatedAt } from '../../domain/value-objects/AccountCreatedAt';
import { AccountUpdatedAt } from '../../domain/value-objects/AccountUpdatedAt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TypeOrmAccountRepository implements AccountRepository {
  constructor(
    @InjectRepository(TypeOrmAccountEntity)
    private readonly accountRepository: Repository<TypeOrmAccountEntity>,
  ) {}

  private toDomain(accountEntity: TypeOrmAccountEntity): Account {
    return new Account(
      new UserId(accountEntity.user_id),
      new AccountName(accountEntity.name),
      new AccountBalance(accountEntity.balance),
      new AccountCreatedAt(accountEntity.created_at),
      new AccountUpdatedAt(accountEntity.updated_at),
      new AccountId(accountEntity.id),
    );
  }

  private toEntity(account: Account): TypeOrmAccountEntity {
    const accountEntity = new TypeOrmAccountEntity();

    accountEntity.id = account.id?.value;
    accountEntity.name = account.name.value;
    accountEntity.balance = account.balance.value;
    accountEntity.user_id = account.user_id.value;
    accountEntity.created_at = account.created_at.value;
    accountEntity.updated_at = account.updated_at.value;

    return accountEntity;
  }

  async create(account: Account): Promise<void> {
    const newAccount = this.toEntity(account);
    await this.accountRepository.save(newAccount);

    account.id = new AccountId(newAccount.id);
    account.created_at = new AccountCreatedAt(newAccount.created_at);
    account.updated_at = new AccountUpdatedAt(newAccount.updated_at);
  }

  async getAll(): Promise<Account[]> {
    const accounts = await this.accountRepository.find();
    return accounts.map(this.toDomain);
  }

  async getOneById(account_id: AccountId): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: {
        id: account_id.value,
      },
    });

    return account ? this.toDomain(account) : null;
  }

  async edit(account: Account): Promise<void> {
    const updatedAccount = this.toEntity(account);
    await this.accountRepository.save(updatedAccount);
  }

  async delete(accountId: AccountId): Promise<void> {
    await this.accountRepository.delete(accountId.value);
  }
}
