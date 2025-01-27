import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports : [
    AuthModule,
    DatabaseModule
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports : [QuoteService]
})
export class QuoteModule {}
