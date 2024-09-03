import { UserRepository } from 'src/lib/User/domain/repository/UserRepository';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';
import { CategoryType } from '../../domain/value-objects/CategoryType';
import { CategoryTypeValidationError } from '../../domain/errors/CategoryTypeValidationError';
import { Category } from '../../domain/entity/Category';
import { CategoryName } from '../../domain/value-objects/CategoryName';
import { CategoryCreatedAt } from '../../domain/value-objects/CategoryCreatedAt';
import { CategoryUpdatedAt } from '../../domain/value-objects/CategoryUpdatedAt';
import { CategoryId } from '../../domain/value-objects/CategoryId';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';
import { TransactionId } from 'src/lib/Transaction/domain/value-objects/TransactionId';
import { TransactionRepository } from 'src/lib/Transaction/domain/repository/TransactionRepository';
import { TransactionNotFoundError } from 'src/lib/Transaction/domain/errors/TransactionNotFoundError';

export class CategoryEdit {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async run(
    id: string,
    name?: string,
    type?: string,
    user_id?: string,
    transaction_ids?: string[],
  ): Promise<void> {
    const categoryExists = await this.categoryRepository.getOneById(
      new CategoryId(id),
    );

    if (!categoryExists) {
      throw new CategoryNotFoundError(`Category with id ${id} not found.`);
    }

    const userExists = await this.userRepository.getOneById(
      new UserId(user_id),
    );

    if (!userExists) {
      throw new UserNotFoundError(`User with id ${user_id} not found.`);
    }

    const categoryType = CategoryType[type as keyof typeof CategoryType];

    if (!categoryType) {
      throw new CategoryTypeValidationError('Category type invalid.');
    }

    const transactions = await Promise.all(
      transaction_ids.map(async (transaction_id) => {
        const transaction = await this.transactionRepository.getOneById(
          new TransactionId(transaction_id),
        );

        if (!transaction) {
          throw new TransactionNotFoundError(
            `Transaction with id ${transaction_id} not found.`,
          );
        }

        return transaction.id;
      }),
    );

    const updatedCategory = new Category(
      new CategoryName(name),
      categoryType,
      userExists.id,
      new CategoryCreatedAt(new Date()),
      new CategoryUpdatedAt(new Date()),
      transaction_ids ? transactions : categoryExists.transaction_ids,
      new CategoryId(id),
    );

    await this.categoryRepository.edit(updatedCategory);
  }
}
