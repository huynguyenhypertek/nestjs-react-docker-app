import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskService } from '../task/task.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly taskService: TaskService) {}

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          // Truy cập file.fieldname và gọi cb sẽ không còn bị đỏ nhờ cấu hình ESLint mới
          cb(null, `${file.fieldname}-${unique}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Chỉ cho phép upload ảnh jpeg/png/jpg'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
    @Body('taskId') taskId: string,
  ) {
    if (!file)
      throw new BadRequestException('Vui lòng chọn file ảnh minh chứng');
    if (!taskId) throw new BadRequestException('Thiếu ID công việc');

    // Chuyển taskId sang Number để khớp với Service
    return await this.taskService.updateProof(
      Number(taskId),
      file.filename,
      req.user,
    );
  }
}
