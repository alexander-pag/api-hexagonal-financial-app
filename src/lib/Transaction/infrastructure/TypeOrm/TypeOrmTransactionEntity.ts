import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../../domain/value-objects/TransactionType';
import { TypeOrmCategoryEntity } from 'src/lib/Category/infrastructure/TypeOrm/TypeOrmCategoryEntity';

@Entity('transaction')
export class TypeOrmTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.INCOME,
  })
  type: TransactionType;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => TypeOrmCategoryEntity, (category) => category.transactions)
  categories: TypeOrmCategoryEntity[];
}
