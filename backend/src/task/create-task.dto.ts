// src/task/create-task.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  task: string; // Phải đặt tên là 'task' để khớp với Entity
}
