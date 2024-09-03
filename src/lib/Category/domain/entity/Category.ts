import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { CategoryId } from '../value-objects/CategoryId';
import { CategoryName } from '../value-objects/CategoryName';
import { CategoryType } from '../value-objects/CategoryType';
import { CategoryCreatedAt } from '../value-objects/CategoryCreatedAt';
import { CategoryUpdatedAt } from '../value-objects/CategoryUpdatedAt';
import { TransactionId } from 'src/lib/Transaction/domain/value-objects/TransactionId';

export class Category {
  id: CategoryId;
  name: CategoryName;
  type: CategoryType;
  user_id: UserId;
  created_at: CategoryCreatedAt;
  updated_at: CategoryUpdatedAt;
  transaction_ids: TransactionId[];

  constructor(
    name: CategoryName,
    type: CategoryType,
    user_id: UserId,
    created_at: CategoryCreatedAt,
    updated_at: CategoryUpdatedAt,
    transaction_ids: TransactionId[],
    id?: CategoryId,
  ) {
    this.name = name;
    this.type = type;
    this.user_id = user_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.transaction_ids = transaction_ids;
    this.id = id;
  }
}
