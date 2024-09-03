import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from './lib/User/infrastructure/TypeOrm/TypeOrmUserEntity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './lib/User/infrastructure/NestJS/user.module';
import { TypeOrmAccountEntity } from './lib/Account/infrastructure/TypeOrm/TypeOrmAccountEntity';
import { AccountModule } from './lib/Account/infrastructure/NestJS/account.module';
import { TransactionModule } from './lib/Transaction/infrastructure/NestJS/transaction.module';
import { TypeOrmTransactionEntity } from './lib/Transaction/infrastructure/TypeOrm/TypeOrmTransactionEntity';
import { TypeOrmCategoryEntity } from './lib/Category/infrastructure/TypeOrm/TypeOrmCategoryEntity';
import { CategoryModule } from './lib/Category/infrastructure/NestJS/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRE_DATABASE_URL,
      entities: [
        TypeOrmUserEntity,
        TypeOrmAccountEntity,
        TypeOrmTransactionEntity,
        TypeOrmCategoryEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    AccountModule,
    TransactionModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
