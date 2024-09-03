import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account')
export class TypeOrmAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  balance: number;

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
}
