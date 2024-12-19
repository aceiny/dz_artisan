import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CertificationModule } from './certification/certification.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfig } from './config/throttler-config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServerStaticConfig } from './config/server-static.config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot(ThrottlerConfig),
    ServeStaticModule.forRoot(ServerStaticConfig),
    DatabaseModule,
    UserModule,
    AuthModule,
    CertificationModule,
    FileModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
