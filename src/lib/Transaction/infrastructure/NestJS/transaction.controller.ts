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
import { TransactionCreate } from '../../application/TransactionCreate/TransactionCreate';
import { TransactionGetAll } from '../../application/TransactionGetAll/TransactionGetAll';
import { TransactionGetOneById } from '../../application/TransactionGetOneById/TransactionGetOneById';
import { TransactionEdit } from '../../application/TransactionEdit/TransactionEdit';
import { TransactionDelete } from '../../application/TransactionDelete/TransactionDelete';
import {
  CreateTransactionDTO,
  EditTransactionDTO,
} from './TransactionValidations';
import { TransactionIdValidationError } from '../../domain/errors/TransactionIdValidationError';
import { TransactionAmountValidationError } from '../../domain/errors/TransactionAmountValidationError';
import { TransactionDescriptionValidationError } from '../../domain/errors/TransactionDescriptionValidationError';
import { TransactionDateValidationError } from '../../domain/errors/TransactionDateValidationError';
import { TransactionTypeValidationError } from '../../domain/errors/TransactionTypeValidationError';
import { TransactionCreatedAtValidationError } from '../../domain/errors/TransactionCreatedAtValidationError';
import { TransactionUpdatedAtValidationError } from '../../domain/errors/TransactionUpdatedAtValidationError';
import { AccountIdValidationError } from 'src/lib/Account/domain/errors/AccountIdValidationError';
import { TransactionNotFoundError } from '../../domain/errors/TransactionNotFoundError';
import { AccountNotFoundError } from 'src/lib/Account/domain/errors/AccountNotFoundError';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TransactionCreate')
    private readonly transactionCreate: TransactionCreate,
    @Inject('TransactionGetAll')
    private readonly transactionGetAll: TransactionGetAll,
    @Inject('TransactionGetOneById')
    private readonly transactionGetOneById: TransactionGetOneById,
    @Inject('TransactionEdit')
    private readonly transactionEdit: TransactionEdit,
    @Inject('TransactionDelete')
    private readonly transactionDelete: TransactionDelete,
  ) {}

  private handleError(error: any) {
    if (
      error instanceof TransactionIdValidationError ||
      error instanceof TransactionAmountValidationError ||
      error instanceof TransactionDescriptionValidationError ||
      error instanceof TransactionDateValidationError ||
      error instanceof TransactionTypeValidationError ||
      error instanceof TransactionCreatedAtValidationError ||
      error instanceof TransactionUpdatedAtValidationError
    ) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof AccountIdValidationError) {
      throw new BadRequestException(error.message);
    }

    if (
      error instanceof TransactionNotFoundError ||
      error instanceof AccountNotFoundError
    ) {
      throw new NotFoundException(error.message);
    }

    // throw error;
    throw new InternalServerErrorException('An unexpected error occurred.');
  }

  @Post()
  async create(@Body() createTransactionDTO: CreateTransactionDTO) {
    const { account_id, amount, type, description, category_ids } =
      createTransactionDTO;
    try {
      return await this.transactionCreate.run(
        account_id,
        type,
        amount,
        category_ids,
        description,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async getAll() {
    try {
      return await this.transactionGetAll.run();
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async getOneById(@Param('id') transaction_id: string) {
    try {
      return await this.transactionGetOneById.run(transaction_id);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id')
  async edit(
    @Param('id') transaction_id: string,
    @Body() editTransactionDTO: EditTransactionDTO,
  ) {
    const { account_id, amount, type, description, category_ids } =
      editTransactionDTO;
    try {
      return await this.transactionEdit.run(
        transaction_id,
        account_id,
        type,
        amount,
        description,
        category_ids,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async delete(@Param('id') transaction_id: string) {
    try {
      return await this.transactionDelete.run(transaction_id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
