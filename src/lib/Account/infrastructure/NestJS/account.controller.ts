import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountCreate } from '../../application/AccountCreate/AccountCreate';
import { AccountGetAll } from '../../application/AccountGetAll/AccountGetAll';
import { AccountGetOneById } from '../../application/AccountGetOneById/AccountGetOneById';
import { AccountEdit } from '../../application/AccountEdit/AccountEdit';
import { AccountDelete } from '../../application/AccountDelete/AccountDelete';
import { AccountIdValidationError } from '../../domain/errors/AccountIdValidationError';
import { AccountNameValidationError } from '../../domain/errors/AccountNameValidationError';
import { AccountBalanceValidationError } from '../../domain/errors/AccountBalanceValidationError';
import { AccountCreatedAtValidationError } from '../../domain/errors/AccountCreatedAtValidationError';
import { AccountUpdatedAtValidationError } from '../../domain/errors/AccountdUpdatedAtValidationError';
import { UserIdValidationError } from 'src/lib/User/domain/errors/UserIdValidationError';
import { UserNotFoundError } from 'src/lib/User/domain/errors/UserNotFoundError';
import { AccountNotFoundError } from '../../domain/errors/AccountNotFoundError';
import { CreateAccountDTO, EditAccountDTO } from './AccountValidations';

@Controller('account')
export class AccountController {
  constructor(
    @Inject('AccountCreate') private readonly accountCreate: AccountCreate,
    @Inject('AccountGetAll') private readonly accountGetAll: AccountGetAll,
    @Inject('AccountGetOneById')
    private readonly accountGetOneById: AccountGetOneById,
    @Inject('AccountEdit') private readonly accountEdit: AccountEdit,
    @Inject('AccountDelete') private readonly accountDelete: AccountDelete,
  ) {}

  private handleError(error: any) {
    if (
      error instanceof AccountIdValidationError ||
      error instanceof AccountNameValidationError ||
      error instanceof AccountBalanceValidationError ||
      error instanceof AccountCreatedAtValidationError ||
      error instanceof AccountUpdatedAtValidationError
    ) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof UserIdValidationError) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof UserNotFoundError || AccountNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  @Get()
  async getAll() {
    try {
      return await this.accountGetAll.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async getOneById(@Param('id') account_id: string) {
    try {
      return await this.accountGetOneById.run(account_id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Post()
  async create(@Body() createAccountDTO: CreateAccountDTO) {
    const { balance, name, user_id } = createAccountDTO;
    try {
      return await this.accountCreate.run(name, balance, user_id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id')
  async edit(
    @Param('id') account_id: string,
    @Body() editAccountDTO: EditAccountDTO,
  ) {
    const { balance, name, user_id } = editAccountDTO;

    try {
      return await this.accountEdit.run(account_id, name, balance, user_id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
