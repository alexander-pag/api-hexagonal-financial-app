import { Category } from 'src/lib/Category/domain/entity/Category';
import { Account } from '../../../../lib/Account/domain/entity/Account';
import { Transaction } from '../../domain/entity/Transaction';

export class TransactionDTO {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: Date;
  account: {
    id: string;
    name: string;
    balance: number;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;

  constructor(
    transaction: Transaction,
    account: Account,
    categories: Category[],
  ) {
    this.id = transaction.id.value;
    this.amount = transaction.amount.value;
    this.type = transaction.type;
    this.description = transaction.description.value;
    this.date = transaction.date.value;
    this.account = {
      id: account.id.value,
      name: account.name.value,
      balance: account.balance.value,
    };
    this.categories = categories.map((category) => ({
      id: category.id.value,
      name: category.name.value,
    }));
  }
}
