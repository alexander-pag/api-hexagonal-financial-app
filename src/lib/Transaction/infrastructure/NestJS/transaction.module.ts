import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTransactionEntity } from '../TypeOrm/TypeOrmTransactionEntity';
import { AccountModule } from 'src/lib/Account/infrastructure/NestJS/account.module';
import { TypeOrmTransactionRepository } from '../TypeOrm/TypeOrmTransactionRepository';
import { TransactionCreate } from '../../application/TransactionCreate/TransactionCreate';
import { TypeOrmAccountRepository } from 'src/lib/Account/infrastructure/TypeOrm/TypeOrmAccountRepository';
import { TransactionGetAll } from '../../application/TransactionGetAll/TransactionGetAll';
import { TransactionGetOneById } from '../../application/TransactionGetOneById/TransactionGetOneById';
import { TransactionEdit } from '../../application/TransactionEdit/TransactionEdit';
import { TransactionDelete } from '../../application/TransactionDelete/TransactionDelete';
import { TransactionController } from './transaction.controller';
import { TypeOrmCategoryRepository } from 'src/lib/Category/infrastructure/TypeOrm/TypeOrmCategoryRepository';
import { CategoryModule } from 'src/lib/Category/infrastructure/NestJS/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTransactionEntity]),
    AccountModule,
    forwardRef(() => CategoryModule),
  ],
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: 'TransactionCreate',
      useFactory: (
        transactionRepository: TypeOrmTransactionRepository,
        accountRepository: TypeOrmAccountRepository,
        categoryRepository: TypeOrmCategoryRepository,
      ) =>
        new TransactionCreate(
          transactionRepository,
          accountRepository,
          categoryRepository,
        ),
      inject: [
        'TransactionRepository',
        'AccountRepository',
        'CategoryRepository',
      ],
    },
    {
      provide: 'TransactionGetAll',
      useFactory: (
        transactionRepository: TypeOrmTransactionRepository,
        accountRepository: TypeOrmAccountRepository,
        categoryRepository: TypeOrmCategoryRepository,
      ) =>
        new TransactionGetAll(
          transactionRepository,
          accountRepository,
          categoryRepository,
        ),
      inject: [
        'TransactionRepository',
        'AccountRepository',
        'CategoryRepository',
      ],
    },
    {
      provide: 'TransactionGetOneById',
      useFactory: (
        transactionRepository: TypeOrmTransactionRepository,
        accountRepository: TypeOrmAccountRepository,
        categoryRepository: TypeOrmCategoryRepository,
      ) =>
        new TransactionGetOneById(
          transactionRepository,
          accountRepository,
          categoryRepository,
        ),
      inject: [
        'TransactionRepository',
        'AccountRepository',
        'CategoryRepository',
      ],
    },
    {
      provide: 'TransactionEdit',
      useFactory: (
        transactionRepository: TypeOrmTransactionRepository,
        accountRepository: TypeOrmAccountRepository,
        categoryRepository: TypeOrmCategoryRepository,
      ) =>
        new TransactionEdit(
          transactionRepository,
          accountRepository,
          categoryRepository,
        ),
      inject: [
        'TransactionRepository',
        'AccountRepository',
        'CategoryRepository',
      ],
    },
    {
      provide: 'TransactionDelete',
      useFactory: (transactionRepository: TypeOrmTransactionRepository) =>
        new TransactionDelete(transactionRepository),
      inject: ['TransactionRepository'],
    },
  ],
  controllers: [TransactionController],
  exports: ['TransactionRepository'],
})
export class TransactionModule {}
