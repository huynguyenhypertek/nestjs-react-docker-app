import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserRole } from '../user/entities/user.entity';

// Giữ nguyên cấu trúc Request chặt chẽ của bạn
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(
    // Thêm async để đồng bộ với Service
    @Request() req: AuthenticatedRequest,
    @Query('page') page: any = 1, // Nhận any để xử lý ép kiểu an toàn hơn
    @Query('limit') limit: any = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    // Ép kiểu Number rõ ràng để đảm bảo logic phân trang skip/take hoạt động chính xác
    return await this.taskService.paginate(
      req.user,
      Number(page),
      Number(limit),
      search,
      status,
    );
  }

  @Post()
  async createTask(
    @Body() body: CreateTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.taskService.create(body, req.user);
  }

  @Patch(':id')
  async toggleTask(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.taskService.toggle(Number(id), req.user);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.taskService.delete(Number(id), req.user);
  }
}
