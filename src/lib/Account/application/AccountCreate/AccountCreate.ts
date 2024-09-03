import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { Account } from '../../domain/entity/Account';
import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountName } from '../../domain/value-objects/AccountName';
import { AccountBalance } from '../../domain/value-objects/AccountBalance';
import { AccountCreatedAt } from '../../domain/value-objects/AccountCreatedAt';
import { AccountUpdatedAt } from '../../domain/value-objects/AccountUpdatedAt';
import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';

export class AccountCreate {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async run(name: string, balance: number, user_id: string): Promise<void> {
    const userExists = await this.userRepository.getOneById(
      new UserId(user_id),
    );

    if (!userExists) {
      throw new UserNotFoundError(`User with id ${user_id} not found.`);
    }

    const newAccount = new Account(
      new UserId(user_id),
      new AccountName(name),
      new AccountBalance(balance),
      new AccountCreatedAt(new Date()),
      new AccountUpdatedAt(new Date()),
    );

    await this.accountRepository.create(newAccount);
  }
}
