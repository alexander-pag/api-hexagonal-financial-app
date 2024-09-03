import { Account } from '../entity/Account';
import { AccountId } from '../value-objects/AccountId';

export interface AccountRepository {
  create(account: Account): Promise<void>;
  getAll(): Promise<Account[]>;
  getOneById(accountId: AccountId): Promise<Account>;
  edit(account: Account): Promise<void>;
  delete(accountId: AccountId): Promise<void>;
}
