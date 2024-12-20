import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(+id, updateExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(+id);
  }
}
