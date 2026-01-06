import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { TaskModule } from '../task/task.module'; // Import Module chứa TaskService

@Module({
  imports: [TaskModule], // ĐƯA VÀO ĐÂY ĐỂ GIẢI QUYẾT LỖI RESOLVE DEPENDENCIES
  controllers: [UploadController],
})
export class UploadModule {}
