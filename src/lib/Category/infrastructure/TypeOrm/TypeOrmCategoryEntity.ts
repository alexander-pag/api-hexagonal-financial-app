import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryType } from '../../domain/value-objects/CategoryType';
import { TypeOrmTransactionEntity } from 'src/lib/Transaction/infrastructure/TypeOrm/TypeOrmTransactionEntity';

@Entity('category')
export class TypeOrmCategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: CategoryType, default: CategoryType.INCOME })
  type: CategoryType;

  @Column()
  user_id: string;

  @Column({
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
  })
  updated_at: Date;

  @ManyToMany(
    () => TypeOrmTransactionEntity,
    (transaction) => transaction.categories,
  )
  @JoinTable()
  transactions: TypeOrmTransactionEntity[];
}
