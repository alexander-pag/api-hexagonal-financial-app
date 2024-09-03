import { TransactionNotFoundError } from '../../domain/errors/TransactionNotFoundError';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { TransactionId } from '../../domain/value-objects/TransactionId';

export class TransactionDelete {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async run(id: string): Promise<void> {
    const transactionExists = await this.transactionRepository.getOneById(
      new TransactionId(id),
    );

    if (!transactionExists) {
      throw new TransactionNotFoundError(
        `Transaction with id ${id} not found.`,
      );
    }

    await this.transactionRepository.delete(new TransactionId(id));
  }
}
