import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/entities/user.entity';

// Decorator này dùng để gắn danh sách các Role yêu cầu vào Metadata của API
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
