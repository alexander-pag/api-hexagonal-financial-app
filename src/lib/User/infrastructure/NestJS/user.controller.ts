import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCreate } from '../../application/UserCreate/UserCreate';
import { UserGetAll } from '../../application/UserGetAll/UserGetAll';
import { UserGetOneById } from '../../application/UserGetOneById/UserGetOneById';
import { UserGetOneByEmail } from '../../application/UserGetOneByEmail copy/UserGetOneByEmail';
import { UserEdit } from '../../application/UserEdit/UserEdit';
import { UserDelete } from '../../application/UserDelete/UserDelete';
import { CreateUserDTO, EditUserDTO, LoginUserDTO } from './UserValidations';
import { UserNameValidationError } from '../../domain/errors/UserNameValidationError';
import { UserEmailValidationError } from '../../domain/errors/UserEmailValidationError';
import { UserPasswordValidationError } from '../../domain/errors/UserPasswordValidationError';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';
import { UserLogin } from '../../application/UserLogin/UserLogin';
import { UserInvalidCredentialsError } from '../../domain/errors/UserInvalidCredentialsError';
import { Public } from './decorator/IsPublic';

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserCreate') private readonly userCreate: UserCreate,
    @Inject('UserLogin') private readonly userLogin: UserLogin,
    @Inject('UserGetAll') private readonly userGetAll: UserGetAll,
    @Inject('UserGetOneById') private readonly userGetOneById: UserGetOneById,
    @Inject('UserGetOneByEmail')
    private readonly userGetOneByEmail: UserGetOneByEmail,
    @Inject('UserEdit') private readonly userEdit: UserEdit,
    @Inject('UserDelete') private readonly userDelete: UserDelete,
  ) {}

  private handleError(error: any) {
    if (
      error instanceof UserNameValidationError ||
      error instanceof UserEmailValidationError ||
      error instanceof UserPasswordValidationError
    ) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof UserAlreadyExistsError) {
      throw new ConflictException(error.message);
    }
    if (error instanceof UserInvalidCredentialsError) {
      throw new UnauthorizedException(error.message);
    }
    if (error instanceof UnauthorizedException) {
      throw new UnauthorizedException(error.message);
    }

    throw new InternalServerErrorException('An unexpected error occurred');
  }

  @Get()
  async getAll() {
    try {
      return await this.userGetAll.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async getOneById(@Param('id') userId: string) {
    try {
      return await this.userGetOneById.run(userId);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':email')
  async getOneByEmail(@Param('email') userEmail: string) {
    try {
      return await this.userGetOneByEmail.run(userEmail);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const { name, email, password } = createUserDTO;

    try {
      await this.userCreate.run(name, email, password);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;

    try {
      const result = await this.userLogin.run(email, password);
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id')
  async edit(@Param('id') userId: string, @Body() editUserDTO: EditUserDTO) {
    try {
      await this.userEdit.run(
        userId,
        editUserDTO.name,
        editUserDTO.email,
        editUserDTO.password,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async delete(@Param('id') userId: string) {
    try {
      await this.userDelete.run(userId);
    } catch (error) {
      this.handleError(error);
    }
  }
}
