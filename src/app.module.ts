import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CertificationModule } from './certification/certification.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, CertificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
