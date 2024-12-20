import { PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
