// src/task/task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { UserRole } from '../user/entities/user.entity';

interface RequestUser {
  id: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
  ) {}

  // CẬP NHẬT: Thay thế findAll bằng paginate để hỗ trợ bài 6
  async paginate(
    user: RequestUser,
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ) {
    const query = this.repo.createQueryBuilder('task');

    // 1. Phân quyền: Nếu không phải Admin thì chỉ lấy task của chính mình
    if (user.role !== UserRole.ADMIN) {
      query.andWhere('task.ownerId = :ownerId', { ownerId: user.id });
    } else {
      // Admin có thể xem thêm thông tin người sở hữu task
      query.leftJoinAndSelect('task.owner', 'owner');
    }

    // 2. Tìm kiếm theo nội dung task (Sử dụng ILIKE để không phân biệt hoa thường)
    if (search) {
      query.andWhere('task.task ILIKE :search', { search: `%${search}%` });
    }

    // 3. Lọc theo trạng thái hoàn thành
    if (status === 'true' || status === 'false') {
      query.andWhere('task.status = :status', { status: status === 'true' });
    }

    // 4. Tính toán phân trang và sắp xếp
    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('task.id', 'DESC');

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Giữ nguyên các hàm findAllAdmin cũ (nếu bạn vẫn cần dùng cho mục đích khác)
  async findAllAdmin() {
    return await this.repo.find({
      relations: ['owner'],
      order: { id: 'DESC' },
    });
  }

  // Giữ nguyên logic Create, Toggle, Delete của bạn
  async create(dto: CreateTaskDto, user: { id?: number; userId?: number }) {
    const currentUserId = user.id || user.userId;
    const newTask = this.repo.create({
      task: dto.task,
      status: false,
      ownerId: currentUserId,
      // imageProof sẽ mặc định là null ở đây, không cần truyền
    });
    return await this.repo.save(newTask);
  }
  async updateProof(taskId: number, filename: string, user: RequestUser) {
    const task = await this.repo.findOne({
      where: { id: taskId, ownerId: user.id },
    });

    if (!task) {
      throw new NotFoundException('Không tìm thấy công việc');
    }

    // Điều kiện Bài 7: Phải hoàn thành mới được upload
    if (task.status !== true) {
      throw new Error('Bạn phải hoàn thành công việc trước khi upload ảnh');
    }

    task.imageProof = filename; // Lưu tên file vào DB
    return await this.repo.save(task);
  }
  async toggle(id: number, user: RequestUser) {
    const task = await this.repo.findOne({
      where: { id, ownerId: user.id },
    });
    if (!task) throw new NotFoundException('Không tìm thấy task');
    task.status = !task.status;
    return await this.repo.save(task);
  }

  async delete(id: number, user: RequestUser) {
    const result = await this.repo.delete({
      id,
      ownerId: user.id,
    });
    if (result.affected === 0)
      throw new NotFoundException('Không tìm thấy task');
    return { success: true };
  }
}
