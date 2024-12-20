import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExperienceService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(
    createExperienceDto: CreateExperienceDto,
    attachments,
    userId: string,
  ) {
    const query = `
    INSERT INTO experiences (
    user_id , title, description, completion_date , attachments)
    VALUES ($1, $2, $3 , $4 , $5)
    RETURNING *
    `;
    const values = [
      userId,
      createExperienceDto.title,
      createExperienceDto.description,
      createExperienceDto.completion_date,
      attachments?.map(
        (attachment: Express.Multer.File) =>
          `${process.env.BACKEND_URL}/uploads/${attachment.filename}`,
      ) || [],
    ];
    const experience = (await this.databaseService.query(query, values))[0];
    return experience;
  }

  async findAllByUserId(userId: string) {
    const query = `
    SELECT * FROM experiences WHERE user_id = $1
    `;
    const values = [userId];
    const experiences = await this.databaseService.query(query, values);
    return experiences;
  }

  async findOne(experienceId: string) {
    const query = `
        SELECT * FROM experiences WHERE experience_id  = $1  
        `;
    const values = [experienceId];
    const experience = (await this.databaseService.query(query, values))[0];
    if (!experience) {
      throw new NotFoundException('Experience Not Found');
    }
    return experience;
  }

  async update(
    experienceId: string,
    userId: string,
    updateExperienceDto: UpdateExperienceDto,
  ) {
    console.log(updateExperienceDto, userId, experienceId);
    const query = `
    UPDATE experiences SET title = $1, description = $2, completion_date = $3
    WHERE experience_id = $4 AND user_id = $5
    RETURNING *
    `;
    const values = [
      updateExperienceDto.title,
      updateExperienceDto.description,
      updateExperienceDto.completion_date,
      experienceId,
      userId,
    ];
    const experience = (await this.databaseService.query(query, values))[0];
    if (!experience) {
      throw new NotFoundException('Experience Not Found');
    }
    return experience;
  }

  async remove(experienceId: string, userId: string) {
    const query = `
    DELETE FROM experiences WHERE experience_id = $1 AND user_id = $2
    RETURNING *
    `;
    const values = [experienceId, userId];
    const experience = (await this.databaseService.query(query, values))[0];
    if (!experience) {
      throw new NotFoundException('Experience Not Found');
    }
    return experience;
  }
}
