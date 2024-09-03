import { AccountRepository } from 'src/lib/Account/domain/repository/AccountRepository';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { TransactionDTO } from '../dto/TransactionDTO';
import { AccountId } from 'src/lib/Account/domain/value-objects/AccountId';
import { AccountNotFoundError } from 'src/lib/Account/domain/errors/AccountNotFoundError';
import { CategoryRepository } from 'src/lib/Category/domain/repository/CategoryRepository';
import { CategoryId } from 'src/lib/Category/domain/value-objects/CategoryId';
import { CategoryNotFoundError } from 'src/lib/Category/domain/errors/CategoryNotFoundError';

export class TransactionGetAll {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async run(): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.getAll();

    const transactionsDTO: TransactionDTO[] = [];

    for (const transaction of transactions) {
      const account = await this.accountRepository.getOneById(
        new AccountId(transaction.account_id.value),
      );

      if (!account) {
        throw new AccountNotFoundError(
          `Account with id ${transaction.account_id.value} not found.`,
        );
      }

      const categories = await Promise.all(
        transaction.category_ids.map(async (category_id) => {
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

      transactionsDTO.push(
        new TransactionDTO(transaction, account, categories),
      );
    }

    return transactionsDTO;
  }
}
