import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class TypeOrmUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'timestamp',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
  })
  updated_at: Date;
}
