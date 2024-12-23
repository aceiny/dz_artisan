import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/global-expection.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger docs set up
  const config = new DocumentBuilder()
    .setTitle('dz_artisan')
    .setDescription('dz artisan api for finding jobs in algeria')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // enable cors
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // enable websocket
  const server = app.getHttpServer();
  app.useWebSocketAdapter(new IoAdapter(server));

  // enable cookie parser
  app.use(cookieParser());

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // add halmet for security ( setting http headers)
  app.use(helmet());

  // add global expection filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // run app on specified port or 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
