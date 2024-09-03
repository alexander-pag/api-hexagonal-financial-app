import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountDTO } from '../dto/AccountDTO';
import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';

export class AccountGetAll {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async run(): Promise<AccountDTO[]> {
    const accounts = await this.accountRepository.getAll();

    const accountsDTO: AccountDTO[] = [];

    for (const account of accounts) {
      const user = await this.userRepository.getOneById(
        new UserId(account.user_id.value),
      );

      if (!user) {
        throw new UserNotFoundError(
          `User with id ${account.user_id.value} not found`,
        );
      }

      accountsDTO.push(new AccountDTO(account, user));
    }

    return accountsDTO;
  }
}
