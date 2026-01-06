import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: string;

  @Column({ default: false })
  status: boolean;

  // Cột mới để lưu minh chứng ảnh
  @Column({ nullable: true })
  imageProof: string;

  @ManyToOne(() => User, (user) => user.tasks)
  owner: User;

  @Column()
  ownerId: number;
}
