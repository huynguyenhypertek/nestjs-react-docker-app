import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // (Check lại đường dẫn file này của bạn)

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule], // <--- BẮT BUỘC PHẢI CÓ DÒNG NÀY
})
export class UsersModule {}
