import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { Transaction } from '../../domain/entity/Transaction';
import { AccountRepository } from 'src/lib/Account/domain/repository/AccountRepository';
import { TransactionId } from '../../domain/value-objects/TransactionId';
import { TransactionNotFoundError } from '../../domain/errors/TransactionNotFoundError';
import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { AccountNotFoundError } from 'src/lib/Account/domain/errors/AccountNotFoundError';
import { TransactionType } from '../../domain/value-objects/TransactionType';
import { TransactionTypeValidationError } from '../../domain/errors/TransactionTypeValidationError';
import { TransactionAmount } from '../../domain/value-objects/TransactionAmount';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionUpdatedAt } from '../../domain/value-objects/TransactionUpdatedAt';
import { TransactionDescription } from '../../domain/value-objects/TransactionDescription';
import { CategoryRepository } from 'src/lib/Category/domain/repository/CategoryRepository';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';
import { CategoryNotFoundError } from 'src/lib/Category/domain/errors/CategoryNotFoundError';

export class TransactionEdit {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async run(
    id: string,
    account_id?: string,
    type?: string,
    amount?: number,
    description?: string,
    category_ids?: string[],
  ): Promise<void> {
    const transactionExists = await this.transactionRepository.getOneById(
      new TransactionId(id),
    );

    if (!transactionExists) {
      throw new TransactionNotFoundError(
        `Transaction with id ${id} not found.`,
      );
    }

    const accountExists = await this.accountRepository.getOneById(
      new AccountId(account_id),
    );

    if (!accountExists) {
      throw new AccountNotFoundError(
        `Account with id ${account_id} not found.`,
      );
    }

    const transactionType =
      TransactionType[type as keyof typeof TransactionType];

    if (!transactionType) {
      throw new TransactionTypeValidationError('Transaction type invalid.');
    }

    const categories = await Promise.all(
      category_ids.map(async (category_id) => {
        const category = await this.categoryRepository.getOneById(
          new CategoryId(category_id),
        );

        if (!category) {
          throw new CategoryNotFoundError(
            `Category with id ${category_id} not found.`,
          );
        }

        return category.id;
      }),
    );

    const updatedTransaction = new Transaction(
      accountExists.id,
      transactionType,
      amount ? new TransactionAmount(amount) : transactionExists.amount,
      transactionExists.date,
      transactionExists.created_at,
      new TransactionUpdatedAt(new Date()),
      category_ids ? categories : transactionExists.category_ids,
      description
        ? new TransactionDescription(description)
        : transactionExists.description,
      new TransactionId(id),
    );

    await this.transactionRepository.edit(updatedTransaction);
  }
}
