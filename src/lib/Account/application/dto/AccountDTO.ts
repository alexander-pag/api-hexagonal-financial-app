import { User } from 'src/lib/User/domain/entity/User';
import { Account } from '../../domain/entity/Account';

export class AccountDTO {
  id: string;
  name: string;
  balance: number;
  user: {
    id: string;
    name: string;
  };

  constructor(account: Account, user: User) {
    this.id = account.id.value;
    this.name = account.name.value;
    this.balance = account.balance.value;
    this.user = {
      id: user.id.value,
      name: user.name.value,
    };
  }
}
