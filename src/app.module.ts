import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificationModule } from './certification/certification.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, CertificationModule, FileModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
