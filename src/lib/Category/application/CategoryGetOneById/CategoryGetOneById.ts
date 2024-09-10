import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';
import { CategoryId } from '../../domain/value-objects/CategoryId';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';
import { TransactionRepository } from 'src/lib/Transaction/domain/repository/TransactionRepository';
import { TransactionNotFoundError } from 'src/lib/Transaction/domain/errors/TransactionNotFoundError';
import { CategoryDTO } from '../dto/CategoryDTO';

export class CategoryGetOneById {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async run(id: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.getOneById(
      new CategoryId(id),
    );

    if (!category) {
      throw new CategoryNotFoundError(`Category with id ${id} not found.`);
    }

    const user = await this.userRepository.getOneById(category.user_id);

    if (!user) {
      throw new UserNotFoundError(
        `User with id ${category.user_id} not found.`,
      );
    }

    const transactions = await Promise.all(
      category.transaction_ids.map(async (transaction_id) => {
        const transaction =
          await this.transactionRepository.getOneById(transaction_id);

        if (!transaction) {
          throw new TransactionNotFoundError(
            `Transaction with id ${transaction_id} not found.`,
          );
        }

        return transaction;
      }),
    );

    return new CategoryDTO(category, user, transactions);
  }
}
