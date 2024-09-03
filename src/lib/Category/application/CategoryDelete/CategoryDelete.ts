import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { Category } from '../../domain/entity/Category';
import { CategoryId } from '../../domain/value-objects/CategoryId';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';

export class CategoryDelete {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async run(id: string): Promise<Category> {
    const category = await this.categoryRepository.getOneById(
      new CategoryId(id),
    );

    if (!category) {
      throw new CategoryNotFoundError(`Category with id ${id} not found.`);
    }

    return category;
  }
}
