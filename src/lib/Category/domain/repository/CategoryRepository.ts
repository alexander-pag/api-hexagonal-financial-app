import { Category } from '../entity/Category';
import { CategoryId } from '../value-objects/CategoryId';

export interface CategoryRepository {
  create(category: Category): Promise<void>;
  getAll(): Promise<Category[]>;
  getOneById(category_id: CategoryId): Promise<Category>;
  edit(category: Category): Promise<void>;
  delete(category_id: CategoryId): Promise<void>;
}
