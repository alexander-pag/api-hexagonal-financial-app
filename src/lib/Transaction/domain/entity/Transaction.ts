import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { TransactionId } from '../value-objects/TransactionId';
import { TransactionType } from '../value-objects/TransactionType';
import { TransactionAmount } from '../value-objects/TransactionAmount';
import { TransactionDescription } from '../value-objects/TransactionDescription';
import { TransactionDate } from '../value-objects/TransactionDate';
import { TransactionCreatedAt } from '../value-objects/TransactionCreatedAt';
import { TransactionUpdatedAt } from '../value-objects/TransactionUpdatedAt';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';

interface TransactionProps {
  id?: TransactionId;
  account_id: AccountId;
  type: TransactionType;
  amount: TransactionAmount;
  description?: TransactionDescription;
  date: TransactionDate;
  created_at: TransactionCreatedAt;
  updated_at: TransactionUpdatedAt;
  category_ids: CategoryId[];
}

export class Transaction {
  id: TransactionId;
  account_id: AccountId;
  type: TransactionType;
  amount: TransactionAmount;
  description: TransactionDescription;
  date: TransactionDate;
  created_at: TransactionCreatedAt;
  updated_at: TransactionUpdatedAt;
  category_ids: CategoryId[];

  constructor({
    account_id,
    type,
    amount,
    date,
    created_at,
    updated_at,
    category_ids,
    description,
    id,
  }: TransactionProps) {
    this.id = id;
    this.account_id = account_id;
    this.type = type;
    this.amount = amount;
    this.description = description;
    this.date = date;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.category_ids = category_ids;
  }
}
