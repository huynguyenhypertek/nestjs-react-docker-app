import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entities/user.entity'; // Nhớ import UserRole

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. Đăng ký tài khoản
  async signup(email: string, password: string, role?: UserRole) {
    const hash = await bcrypt.hash(password, 10);

    // Khởi tạo user mới với trường role (mặc định là 'user' nếu không truyền)
    const newUser = this.usersRepository.create({
      email,
      password: hash,
      role: role ?? UserRole.USER, //
    });

    return this.usersRepository.save(newUser);
  }

  // 2. Đăng nhập và tạo Token chứa Role
  async signin(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    // Bước II: Thêm role vào payload của JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role, // Thông tin này sẽ được dùng bởi RolesGuard sau này
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
