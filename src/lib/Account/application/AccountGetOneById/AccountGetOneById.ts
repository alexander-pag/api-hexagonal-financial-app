import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountId } from '../../domain/value-objects/AccountId';
import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { AccountNotFoundError } from '../../domain/errors/AccountNotFoundError';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';
import { AccountDTO } from '../dto/AccountDTO';

export class AccountGetOneById {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async run(account_id: string): Promise<AccountDTO> {
    const account = await this.accountRepository.getOneById(
      new AccountId(account_id),
    );

    if (!account) {
      throw new AccountNotFoundError(
        `Account with id ${account_id} not found.`,
      );
    }

    const user = await this.userRepository.getOneById(
      new UserId(account.user_id.value),
    );

    if (!user) {
      throw new UserNotFoundError(
        `User with id ${account.user_id.value} not found.`,
      );
    }

    return new AccountDTO(account, user);
  }
}
