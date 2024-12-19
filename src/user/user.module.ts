import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [DatabaseModule, AuthModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
