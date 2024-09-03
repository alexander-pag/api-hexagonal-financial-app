import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from '../TypeOrm/TypeOrmUserEntity';
import { TypeOrmUserRepository } from '../TypeOrm/TypeOrmUserRepository';
import { UserCreate } from '../../application/UserCreate/UserCreate';
import { PasswordManagementService } from '../service/PasswordManagement.service';
import { UserGetAll } from '../../application/UserGetAll/UserGetAll';
import { UserGetOneById } from '../../application/UserGetOneById/UserGetOneById';
import { UserGetOneByEmail } from '../../application/UserGetOneByEmail copy/UserGetOneByEmail';
import { UserEdit } from '../../application/UserEdit/UserEdit';
import { UserDelete } from '../../application/UserDelete/UserDelete';
import { UserController } from './user.controller';
import { UserLogin } from '../../application/UserLogin/UserLogin';
import { JwtNestJSRepository } from '../Jwt/JwtNestJSRepository';
import { TokenManagementRepository } from '../../domain/repository/TokenManagementRepository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/AuthGuard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECURE_KEY'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: 'UserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'PasswordRepository',
      useClass: PasswordManagementService,
    },
    {
      provide: 'TokenManagementRepository',
      useClass: JwtNestJSRepository,
    },
    {
      provide: 'UserCreate',
      useFactory: (
        userRepository: TypeOrmUserRepository,
        passwordManagementService: PasswordManagementService,
      ) => new UserCreate(userRepository, passwordManagementService),
      inject: ['UserRepository', 'PasswordRepository'],
    },
    {
      provide: 'UserLogin',
      useFactory: (
        userRepository: TypeOrmUserRepository,
        passwordManagementService: PasswordManagementService,
        tokenManagementRepository: TokenManagementRepository,
      ) =>
        new UserLogin(
          userRepository,
          passwordManagementService,
          tokenManagementRepository,
        ),
      inject: [
        'UserRepository',
        'PasswordRepository',
        'TokenManagementRepository',
      ],
    },
    {
      provide: 'UserGetAll',
      useFactory: (userRepository: TypeOrmUserRepository) =>
        new UserGetAll(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: 'UserGetOneById',
      useFactory: (userRepository: TypeOrmUserRepository) =>
        new UserGetOneById(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: 'UserGetOneByEmail',
      useFactory: (userRepository: TypeOrmUserRepository) =>
        new UserGetOneByEmail(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: 'UserEdit',
      useFactory: (
        userRepository: TypeOrmUserRepository,
        passwordManagementService: PasswordManagementService,
      ) => new UserEdit(userRepository, passwordManagementService),
      inject: ['UserRepository', 'PasswordRepository'],
    },
    {
      provide: 'UserDelete',
      useFactory: (userRepository: TypeOrmUserRepository) =>
        new UserDelete(userRepository),
      inject: ['UserRepository'],
    },
  ],
  controllers: [UserController],
  exports: ['UserRepository', 'TokenManagementRepository'],
})
export class UserModule {}
