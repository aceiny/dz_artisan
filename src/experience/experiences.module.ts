import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';

@Module({
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
