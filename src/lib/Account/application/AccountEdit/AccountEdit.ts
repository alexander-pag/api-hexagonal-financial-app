import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { Account } from '../../domain/entity/Account';
import { AccountNotFoundError } from '../../domain/errors/AccountNotFoundError';
import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountId } from '../../domain/value-objects/AccountId';
import { AccountName } from '../../domain/value-objects/AccountName';
import { AccountBalance } from '../../domain/value-objects/AccountBalance';
import { AccountUpdatedAt } from '../../domain/value-objects/AccountUpdatedAt';
import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';

export class AccountEdit {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async run(
    id: string,
    name?: string,
    balance?: number,
    user_id?: string,
  ): Promise<void> {
    const accountExists = await this.accountRepository.getOneById(
      new AccountId(id),
    );

    if (!accountExists) {
      throw new AccountNotFoundError(`Account with id ${id} not found.`);
    }

    const userExists = await this.userRepository.getOneById(
      new UserId(user_id),
    );

    if (!userExists) {
      throw new UserNotFoundError(`User with id ${id} not found.`);
    }

    const updatedAccount = new Account(
      user_id ? new UserId(user_id) : accountExists.user_id,
      name ? new AccountName(name) : accountExists.name,
      balance ? new AccountBalance(balance) : accountExists.balance,
      accountExists.created_at,
      new AccountUpdatedAt(new Date()),
      new AccountId(id),
    );

    await this.accountRepository.edit(updatedAccount);
  }
}
