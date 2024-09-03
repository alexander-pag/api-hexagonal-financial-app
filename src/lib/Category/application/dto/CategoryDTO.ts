import { User } from 'src/lib/User/domain/entity/User';
import { Category } from '../../domain/entity/Category';
import { Transaction } from 'src/lib/Transaction/domain/entity/Transaction';

export class CategoryDTO {
  id: string;
  name: string;
  type: string;
  user: {
    id: string;
    name: string;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
  }>;

  constructor(category: Category, user: User, transactions: Transaction[]) {
    this.id = category.id.value;
    this.name = category.name.value;
    this.type = category.type;
    this.user = {
      id: user.id.value,
      name: user.name.value,
    };
    this.transactions = transactions.map((transaction) => ({
      id: transaction.id.value,
      type: transaction.type,
      amount: transaction.amount.value,
    }));
  }
}
