import { UserId } from 'src/lib/User/domain/value-objects/UserId';
import { Category } from '../../domain/entity/Category';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { CategoryId } from '../../domain/value-objects/CategoryId';
import { CategoryName } from '../../domain/value-objects/CategoryName';
import { CategoryType } from '../../domain/value-objects/CategoryType';
import { TypeOrmCategoryEntity } from './TypeOrmCategoryEntity';
import { CategoryCreatedAt } from '../../domain/value-objects/CategoryCreatedAt';
import { CategoryUpdatedAt } from '../../domain/value-objects/CategoryUpdatedAt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionId } from 'src/lib/Transaction/domain/value-objects/TransactionId';
import { TypeOrmTransactionEntity } from 'src/lib/Transaction/infrastructure/TypeOrm/TypeOrmTransactionEntity';

export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(TypeOrmCategoryEntity)
    private readonly categoryRepository: Repository<TypeOrmCategoryEntity>,
  ) {}

  private toDomain(categoryEntity: TypeOrmCategoryEntity): Category {
    const categoryType =
      CategoryType[categoryEntity.type as keyof typeof CategoryType];

    const transaction_ids = (categoryEntity.transactions ?? []).map(
      (transaction) => new TransactionId(transaction.id),
    );

    return new Category(
      new CategoryName(categoryEntity.name),
      categoryType,
      new UserId(categoryEntity.user_id),
      new CategoryCreatedAt(new Date(categoryEntity.created_at)),
      new CategoryUpdatedAt(new Date(categoryEntity.updated_at)),
      transaction_ids,
      new CategoryId(categoryEntity.id),
    );
  }

  private toEntity(category: Category): TypeOrmCategoryEntity {
    const transaction_ids = (category.transaction_ids ?? []).map(
      (transaction_id) => {
        const transactionEntity = new TypeOrmTransactionEntity();
        transactionEntity.id = transaction_id.value;
        return transactionEntity;
      },
    );

    const categoryEntity = new TypeOrmCategoryEntity();

    categoryEntity.id = category.id?.value;
    categoryEntity.name = category.name.value;
    categoryEntity.type = category.type;
    categoryEntity.user_id = category.user_id.value;
    categoryEntity.created_at = category.created_at.value;
    categoryEntity.updated_at = category.updated_at.value;
    categoryEntity.transactions = transaction_ids;

    return categoryEntity;
  }

  async create(category: Category): Promise<void> {
    const newCategory = this.toEntity(category);
    await this.categoryRepository.save(newCategory);

    category.id = new CategoryId(newCategory.id);
  }

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: ['transactions'],
    });

    return categories.map(this.toDomain);
  }

  async getOneById(category_id: CategoryId): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: category_id.value,
      },
    });

    return category ? this.toDomain(category) : null;
  }

  async edit(category: Category): Promise<void> {
    const updatedCategoy = this.toEntity(category);
    await this.categoryRepository.save(updatedCategoy);
  }

  async delete(category_id: CategoryId): Promise<void> {
    await this.categoryRepository.delete(category_id.value);
  }
}
