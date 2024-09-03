import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryCreate } from '../../application/CategoryCreate/CategoryCreate';
import { CategoryGetAll } from '../../application/CategoryGetAll/CategoryGetAll';
import { CategoryGetOneById } from '../../application/CategoryGetOneById/CategoryGetOneById';
import { CategoryEdit } from '../../application/CategoryEdit/CategoryEdit';
import { CategoryDelete } from '../../application/CategoryDelete/CategoryDelete';
import { CreateCategory, EditCategory } from './CategoryValidations';
import { CategoryIdValidationError } from '../../domain/errors/CategoryIdValidationError';
import { CategoryNameValidationError } from '../../domain/errors/CategoryNameValidationError';
import { CategoryCreatedAtValidationError } from '../../domain/errors/CategoryCreatedAtValidationError';
import { CategoryUpdatedAtValidationError } from '../../domain/errors/CategoryUpdatedAtValidationError';
import { CategoryTypeValidationError } from '../../domain/errors/CategoryTypeValidationError';
import { UserIdValidationError } from 'src/lib/User/domain/errors/UserIdValidationError';
import { CategoryNotFoundError } from '../../domain/errors/CategoryNotFoundError';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';

@Controller('category')
export class CategoryController {
  constructor(
    @Inject('CategoryCreate') private readonly categoryCreate: CategoryCreate,
    @Inject('CategoryGetAll') private readonly categoryGetAll: CategoryGetAll,
    @Inject('CategoryGetOneById')
    private readonly categoryGetOneById: CategoryGetOneById,
    @Inject('CategoryEdit') private readonly categoryEdit: CategoryEdit,
    @Inject('CategoryDelete') private readonly categoryDelete: CategoryDelete,
  ) {}

  private handleError(error: any) {
    if (
      error instanceof CategoryIdValidationError ||
      error instanceof CategoryNameValidationError ||
      error instanceof CategoryTypeValidationError ||
      error instanceof CategoryCreatedAtValidationError ||
      error instanceof CategoryUpdatedAtValidationError
    ) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof UserIdValidationError) {
      throw new BadRequestException(error.message);
    }
    if (
      error instanceof CategoryNotFoundError ||
      error instanceof UserNotFoundError
    ) {
      throw new NotFoundException(error.message);
    }

    // throw error;
    throw new InternalServerErrorException('An unexpected error occurred.');
  }

  @Post()
  async create(@Body() createCategory: CreateCategory) {
    const { name, type, user_id, transaction_ids } = createCategory;

    try {
      return await this.categoryCreate.run(
        name,
        type,
        user_id,
        transaction_ids,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.categoryGetAll.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async getOneById(@Param('id') category_id: string) {
    try {
      return await this.categoryGetOneById.run(category_id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id')
  async edit(
    @Param('id') category_id: string,
    @Body() editCategory: EditCategory,
  ) {
    const { name, type, user_id, transactions } = editCategory;

    try {
      return await this.categoryEdit.run(
        category_id,
        name,
        type,
        user_id,
        transactions,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') account_id: string) {
    try {
      return await this.categoryDelete.run(account_id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
