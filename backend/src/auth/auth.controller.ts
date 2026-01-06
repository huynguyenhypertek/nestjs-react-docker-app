import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from '../user/entities/user.entity'; // Thêm import

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  // Cập nhật để có thể nhận role khi đăng ký (Tùy chọn cho việc test Admin)
  signup(@Body() dto: { email: string; password: string; role?: UserRole }) {
    return this.authService.signup(dto.email, dto.password, dto.role);
  }

  @Post('signin')
  signin(@Body() dto: { email: string; password: string }) {
    return this.authService.signin(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  // Sửa userId thành id để khớp với JwtStrategy đã sửa
  getProfile(
    @Req() req: { user: { id: number; email: string; role: string } },
  ) {
    return req.user;
  }
}
