import { AccountRepository } from 'src/lib/Account/domain/repository/AccountRepository';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { TransactionDTO } from '../dto/TransactionDTO';
import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { AccountNotFoundError } from 'src/lib/Account/domain/errors/AccountNotFoundError';
import { TransactionId } from '../../domain/value-objects/TransactionId';
import { CategoryRepository } from 'src/lib/Category/domain/repository/CategoryRepository';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';
import { CategoryNotFoundError } from 'src/lib/Category/domain/errors/CategoryNotFoundError';

export class TransactionGetOneById {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async run(transaction_id: string): Promise<TransactionDTO> {
    const transactionExists = await this.transactionRepository.getOneById(
      new TransactionId(transaction_id),
    );

    if (!transactionExists) {
      throw new AccountNotFoundError(
        `Transaction with id ${transactionExists.account_id.value} not found.`,
      );
    }

    const account = await this.accountRepository.getOneById(
      new AccountId(transactionExists.account_id.value),
    );

    if (!account) {
      throw new AccountNotFoundError(
        `Account with id ${transactionExists.account_id.value} not found.`,
      );
    }

    const categories = await Promise.all(
      transactionExists.category_ids.map(async (category_id) => {
        const category = await this.categoryRepository.getOneById(
          new CategoryId(category_id.value),
        );

        if (!category) {
          throw new CategoryNotFoundError(
            `Category with id ${category_id.value} not found.`,
          );
        }

        return category;
      }),
    );

    return new TransactionDTO(transactionExists, account, categories);
  }
}
