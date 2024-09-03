import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmCategoryEntity } from '../TypeOrm/TypeOrmCategoryEntity';
import { TypeOrmCategoryRepository } from '../TypeOrm/TypeOrmCategoryRepository';
import { TypeOrmUserRepository } from 'src/lib/User/infrastructure/TypeOrm/TypeOrmUserRepository';
import { CategoryCreate } from '../../application/CategoryCreate/CategoryCreate';
import { CategoryGetAll } from '../../application/CategoryGetAll/CategoryGetAll';
import { CategoryGetOneById } from '../../application/CategoryGetOneById/CategoryGetOneById';
import { CategoryEdit } from '../../application/CategoryEdit/CategoryEdit';
import { CategoryDelete } from '../../application/CategoryDelete/CategoryDelete';
import { CategoryController } from './category.controller';
import { UserModule } from 'src/lib/User/infrastructure/NestJS/user.module';
import { TypeOrmTransactionRepository } from 'src/lib/Transaction/infrastructure/TypeOrm/TypeOrmTransactionRepository';
import { TransactionModule } from 'src/lib/Transaction/infrastructure/NestJS/transaction.module';
import { TransactionRepository } from 'src/lib/Transaction/domain/repository/TransactionRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmCategoryEntity]),
    UserModule,
    forwardRef(() => TransactionModule),
  ],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: TypeOrmCategoryRepository,
    },
    {
      provide: 'CategoryCreate',
      useFactory: (
        categoryRepository: TypeOrmCategoryRepository,
        userRepository: TypeOrmUserRepository,
        transactionRepository: TypeOrmTransactionRepository,
      ) =>
        new CategoryCreate(
          categoryRepository,
          userRepository,
          transactionRepository,
        ),
      inject: ['CategoryRepository', 'UserRepository', 'TransactionRepository'],
    },
    {
      provide: 'CategoryGetAll',
      useFactory: (
        categoryRepository: TypeOrmCategoryRepository,
        userRepository: TypeOrmUserRepository,
        transactionRepository: TransactionRepository,
      ) =>
        new CategoryGetAll(
          categoryRepository,
          userRepository,
          transactionRepository,
        ),
      inject: ['CategoryRepository', 'UserRepository', 'TransactionRepository'],
    },
    {
      provide: 'CategoryGetOneById',
      useFactory: (
        categoryRepository: TypeOrmCategoryRepository,
        userRepository: TypeOrmUserRepository,
        transactionRepository: TransactionRepository,
      ) =>
        new CategoryGetOneById(
          categoryRepository,
          userRepository,
          transactionRepository,
        ),
      inject: ['CategoryRepository', 'UserRepository', 'TransactionRepository'],
    },
    {
      provide: 'CategoryEdit',
      useFactory: (
        categoryRepository: TypeOrmCategoryRepository,
        userRepository: TypeOrmUserRepository,
        transactionRepository: TypeOrmTransactionRepository,
      ) =>
        new CategoryEdit(
          categoryRepository,
          userRepository,
          transactionRepository,
        ),
      inject: ['CategoryRepository', 'UserRepository', 'TransactionRepository'],
    },
    {
      provide: 'CategoryDelete',
      useFactory: (categoryRepository: TypeOrmCategoryRepository) =>
        new CategoryDelete(categoryRepository),
      inject: ['CategoryRepository'],
    },
  ],

  controllers: [CategoryController],
  exports: ['CategoryRepository'],
})
export class CategoryModule {}
