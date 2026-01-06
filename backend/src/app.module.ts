import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { User } from './user/entities/user.entity';
import { Task } from './task/task.entity';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Sửa 'localhost' thành 'db' để kết nối với container database
      host: process.env.NODE_ENV === 'production' ? 'db' : 'localhost',
      // Sửa 5433 thành 5432 (cổng mặc định bên trong mạng Docker)
      port: process.env.NODE_ENV === 'production' ? 5432 : 5433,
      username: 'postgres',
      password: 'admin123',
      database: 'task_management',
      entities: [User, Task],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/files',
    }),
    AuthModule,
    UsersModule,
    TaskModule,
    UploadModule,
  ],
})
export class AppModule {}
