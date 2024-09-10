import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';
import { CategoryDTO } from '../dto/CategoryDTO';
import { TransactionId } from 'src/lib/Transaction/domain/value-objects/TransactionId';
import { TransactionRepository } from 'src/lib/Transaction/domain/repository/TransactionRepository';
import { TransactionNotFoundError } from 'src/lib/Transaction/domain/errors/TransactionNotFoundError';

export class CategoryGetAll {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async run(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.getAll();

    const categoriesDTO: CategoryDTO[] = [];

    for (const category of categories) {
      const transaction_ids = category.transaction_ids.map(
        (transaction_id) => new TransactionId(transaction_id.value),
      );
      const transactions = await Promise.all(
        transaction_ids.map(async (transaction_id) => {
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

      const user = await this.userRepository.getOneById(category.user_id);
      if (!user) {
        throw new UserNotFoundError(
          `User with id ${category.user_id} not found.`,
        );
      }

      categoriesDTO.push(new CategoryDTO(category, user, transactions));
    }

    return categoriesDTO;
  }
}
