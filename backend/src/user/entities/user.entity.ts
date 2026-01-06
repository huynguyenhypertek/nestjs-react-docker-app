import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../task/task.entity';

// 1. Khai báo Enum để định nghĩa các vai trò trong hệ thống
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // 2. Thêm trường role với kiểu dữ liệu enum
  // default: UserRole.USER đảm bảo mọi tài khoản mới tạo đều là người dùng thường
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // 3. Giữ nguyên quan hệ One-to-Many với bảng Task của bạn
  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];
}
