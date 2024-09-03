import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmAccountEntity } from '../TypeOrm/TypeOrmAccountEntity';
import { TypeOrmAccountRepository } from '../TypeOrm/TypeOrmAccountRepository';
import { TypeOrmUserRepository } from 'src/lib/User/infrastructure/TypeOrm/TypeOrmUserRepository';
import { AccountCreate } from '../../application/AccountCreate/AccountCreate';
import { AccountGetAll } from '../../application/AccountGetAll/AccountGetAll';
import { AccountGetOneById } from '../../application/AccountGetOneById/AccountGetOneById';
import { AccountEdit } from '../../application/AccountEdit/AccountEdit';
import { AccountDelete } from '../../application/AccountDelete/AccountDelete';
import { AccountController } from './account.controller';
import { UserModule } from 'src/lib/User/infrastructure/NestJS/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmAccountEntity]), UserModule],
  providers: [
    {
      provide: 'AccountRepository',
      useClass: TypeOrmAccountRepository,
    },
    {
      provide: 'AccountCreate',
      useFactory: (
        accountRepository: TypeOrmAccountRepository,
        userRepository: TypeOrmUserRepository,
      ) => new AccountCreate(accountRepository, userRepository),
      inject: ['AccountRepository', 'UserRepository'],
    },
    {
      provide: 'AccountGetAll',
      useFactory: (
        accountRepository: TypeOrmAccountRepository,
        userRepository: TypeOrmUserRepository,
      ) => new AccountGetAll(accountRepository, userRepository),
      inject: ['AccountRepository', 'UserRepository'],
    },
    {
      provide: 'AccountGetOneById',
      useFactory: (
        accountRepository: TypeOrmAccountRepository,
        userRepository: TypeOrmUserRepository,
      ) => new AccountGetOneById(accountRepository, userRepository),
      inject: ['AccountRepository', 'UserRepository'],
    },
    {
      provide: 'AccountEdit',
      useFactory: (
        accountRepository: TypeOrmAccountRepository,
        userRepository: TypeOrmUserRepository,
      ) => new AccountEdit(accountRepository, userRepository),
      inject: ['AccountRepository', 'UserRepository'],
    },
    {
      provide: 'AccountDelete',
      useFactory: (accountRepository: TypeOrmAccountRepository) =>
        new AccountDelete(accountRepository),
      inject: ['AccountRepository'],
    },
  ],
  controllers: [AccountController],
  exports: ['AccountRepository'],
})
export class AccountModule {}
