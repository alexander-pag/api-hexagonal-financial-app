import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../domain/entity/Transaction';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { TransactionId } from '../../domain/value-objects/TransactionId';
import { TypeOrmTransactionEntity } from './TypeOrmTransactionEntity';
import { Repository } from 'typeorm';
import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { TransactionType } from '../../domain/value-objects/TransactionType';
import { TransactionAmount } from '../../domain/value-objects/TransactionAmount';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionCreatedAt } from '../../domain/value-objects/TransactionCreatedAt';
import { TransactionUpdatedAt } from '../../domain/value-objects/TransactionUpdatedAt';
import { TransactionDescription } from '../../domain/value-objects/TransactionDescription';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';
import { TypeOrmCategoryEntity } from 'src/lib/Category/infrastructure/TypeOrm/TypeOrmCategoryEntity';

export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TypeOrmTransactionEntity)
    private readonly transactionRepository: Repository<TypeOrmTransactionEntity>,
  ) {}

  private toDomain(transactionEntity: TypeOrmTransactionEntity): Transaction {
    const transactionType =
      TransactionType[transactionEntity.type as keyof typeof TransactionType];

    const category_ids = (transactionEntity.categories ?? []).map(
      (category) => new CategoryId(category.id),
    );

    return new Transaction(
      new AccountId(transactionEntity.account_id),
      transactionType,
      new TransactionAmount(transactionEntity.amount),
      new TransactionDate(transactionEntity.date),
      new TransactionCreatedAt(transactionEntity.created_at),
      new TransactionUpdatedAt(transactionEntity.updated_at),
      category_ids,
      new TransactionDescription(transactionEntity.description),
      new TransactionId(transactionEntity.id),
    );
  }

  private toEntity(transaction: Transaction): TypeOrmTransactionEntity {
    const category_ids = (transaction.category_ids ?? []).map((category_id) => {
      const categoryEntity = new TypeOrmCategoryEntity();
      categoryEntity.id = category_id.value;
      return categoryEntity;
    });

    const transactionEntity = new TypeOrmTransactionEntity();

    transactionEntity.id = transaction.id?.value;
    transactionEntity.account_id = transaction.account_id.value;
    transactionEntity.amount = transaction.amount.value;
    transactionEntity.description = transaction.description.value;
    transactionEntity.type = transaction.type;
    transactionEntity.date = transaction.date?.value || new Date();
    transactionEntity.created_at = transaction.created_at?.value || new Date();
    transactionEntity.updated_at = transaction.updated_at?.value || new Date();
    transactionEntity.categories = category_ids;

    return transactionEntity;
  }

  async create(transaction: Transaction): Promise<void> {
    const transactionEntity = this.toEntity(transaction);
    await this.transactionRepository.save(transactionEntity);
    transaction.id = new TransactionId(transactionEntity.id);
  }

  async getAll(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['categories'],
    });
    return transactions.map(this.toDomain);
  }

  async getOneById(transaction_id: TransactionId): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transaction_id.value,
      },
    });

    return transaction ? this.toDomain(transaction) : null;
  }

  async edit(transaction: Transaction): Promise<void> {
    const transactionEntity = this.toEntity(transaction);
    await this.transactionRepository.save(transactionEntity);
  }

  async delete(transaction_id: TransactionId): Promise<void> {
    await this.transactionRepository.delete(transaction_id.value);
  }
}
