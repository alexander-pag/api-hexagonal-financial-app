import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { AccountId } from '../value-objects/AccountId';
import { AccountName } from '../value-objects/AccountName';
import { AccountBalance } from '../value-objects/AccountBalance';
import { AccountCreatedAt } from '../value-objects/AccountCreatedAt';
import { AccountUpdatedAt } from '../value-objects/AccountUpdatedAt';

export class Account {
  id: AccountId;
  user_id: UserId;
  name: AccountName;
  balance: AccountBalance;
  created_at: AccountCreatedAt;
  updated_at: AccountUpdatedAt;

  constructor(
    user_id: UserId,
    name: AccountName,
    balance: AccountBalance,
    created_at?: AccountCreatedAt,
    updated_at?: AccountUpdatedAt,
    id?: AccountId,
  ) {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.user_id = user_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
