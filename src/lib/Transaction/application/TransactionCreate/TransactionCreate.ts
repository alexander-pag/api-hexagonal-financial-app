import { AccountRepository } from 'src/lib/Account/domain/repository/AccountRepository';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { AccountNotFoundError } from 'src/lib/Account/domain/errors/AccountNotFoundError';
import { TransactionType } from '../../domain/value-objects/TransactionType';
import { TransactionTypeValidationError } from '../../domain/errors/TransactionTypeValidationError';
import { Transaction } from '../../domain/entity/Transaction';
import { TransactionDate } from '../../domain/value-objects/TransactionDate';
import { TransactionCreatedAt } from '../../domain/value-objects/TransactionCreatedAt';
import { TransactionUpdatedAt } from '../../domain/value-objects/TransactionUpdatedAt';
import { TransactionAmount } from '../../domain/value-objects/TransactionAmount';
import { TransactionDescription } from '../../domain/value-objects/TransactionDescription';
import { CategoryRepository } from 'src/lib/Category/domain/repository/CategoryRepository';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';
import { CategoryNotFoundError } from 'src/lib/Category/domain/errors/CategoryNotFoundError';
import { InsufficientFundsError } from '../../domain/errors/InsufficientFundsError';
import { Account } from 'src/lib/Account/domain/entity/Account';

export class TransactionCreate {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async run(
    account_id: string,
    type: string,
    amount: number,
    category_ids: string[],
    description?: string,
  ): Promise<void> {
    const transactionType = this.validateTransactionType(type);
    const account = await this.validateAccount(account_id);
    await this.validateSufficientFunds(account, amount, transactionType);
    const categories = await this.validateCategories(category_ids);

    const newTransaction = new Transaction({
      account_id: new AccountId(account_id),
      type: transactionType,
      amount: new TransactionAmount(amount),
      date: new TransactionDate(new Date()),
      created_at: new TransactionCreatedAt(new Date()),
      updated_at: new TransactionUpdatedAt(new Date()),
      category_ids: categories,
      description: new TransactionDescription(description),
    });

    await this.transactionRepository.create(newTransaction);
  }

  private validateTransactionType(type: string): TransactionType {
    const transactionType =
      TransactionType[type as keyof typeof TransactionType];

    if (!transactionType) {
      throw new TransactionTypeValidationError('Transaction type is invalid.');
    }

    return transactionType;
  }

  private async validateAccount(account_id: string): Promise<Account> {
    const accountExists = await this.accountRepository.getOneById(
      new AccountId(account_id),
    );

    if (!accountExists) {
      throw new AccountNotFoundError(
        `Account with id ${account_id} not found.`,
      );
    }

    return accountExists;
  }

  private async validateSufficientFunds(
    account: Account,
    amount: number,
    transactionType: TransactionType,
  ): Promise<void> {
    if (
      amount > account.balance.value &&
      transactionType == TransactionType.EXPENSE
    ) {
      throw new InsufficientFundsError(
        'Insufficient funds for this transaction.',
      );
    }
  }

  private async validateCategories(
    category_ids: string[],
  ): Promise<CategoryId[]> {
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

    return categories;
  }
}
