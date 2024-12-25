import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [DatabaseModule, AuthModule, QueueModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
