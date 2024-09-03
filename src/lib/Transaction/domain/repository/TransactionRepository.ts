import { Transaction } from '../entity/Transaction';
import { TransactionId } from '../value-objects/TransactionId';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<void>;
  getAll(): Promise<Transaction[]>;
  getOneById(transaction_id: TransactionId): Promise<Transaction>;
  edit(transaction: Transaction): Promise<void>;
  delete(transaction_id: TransactionId): Promise<void>;
}
