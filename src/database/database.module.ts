import { Module } from '@nestjs/common';
import { pgPoolConfig } from 'src/config/database.config';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
