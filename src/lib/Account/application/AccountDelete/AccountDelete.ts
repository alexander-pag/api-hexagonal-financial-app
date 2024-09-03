import { AccountRepository } from '../../domain/repository/AccountRepository';
import { AccountId } from '../../domain/value-objects/AccountId';

export class AccountDelete {
  constructor(private readonly accountRepository: AccountRepository) {}

  async run(accountId: string): Promise<void> {
    await this.accountRepository.delete(new AccountId(accountId));
  }
}
