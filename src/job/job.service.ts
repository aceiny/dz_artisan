import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JobService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createJobDto: CreateJobDto, userId: string) {
    const query = `INSERT INTO jobs (user_id , title, description, location, job_type, minimum_price , estimated_duration , tags, attachments) VALUES ($1, $2, $3, $4, $5 , $6 , $7 , $8 , $9) RETURNING *`;
    const values = [
      userId,
      createJobDto.title,
      createJobDto.description,
      createJobDto.location,
      createJobDto.job_type,
      createJobDto.minimum_price,
      createJobDto.estimated_duration,
      createJobDto.tags,
      createJobDto.attachments?.map(
        (attachment: Express.Multer.File) =>
          `${process.env.BACKEND_URL}/uploads/${attachment.filename}`,
      ) || [],
    ];
    const job = (await this.databaseService.query(query, values))[0];
    return job;
  }

  async findAllJobCreatedByArtisan(userId: string) {
    console.log(userId);
    const query = `SELECT * FROM jobs WHERE user_id = $1`;
    return this.databaseService.query(query, [userId]);
  }

  async findJobByQueries(
    title?: string,
    location?: string,
    job_type?: string,
    minimum_price?: number,
    tags?: string,
  ) {
    let query = `SELECT * FROM jobs WHERE 1=1`;
    const values = [];
    let index = 1;

    if (title) {
      query += ` AND title ~* $${index++}`;
      values.push(title);
    }
    if (location) {
      query += ` AND location ~* $${index++}`;
      values.push(location);
    }
    if (job_type) {
      query += ` AND job_type ~* $${index++}`;
      values.push(job_type);
    }
    if (minimum_price) {
      query += ` AND minimum_price ~* $${index++}`;
      values.push(minimum_price);
    }
    if (tags) {
      query += ` AND tags @> $${index++}::text[]`;
      values.push(tags.split(','));
    }

    return this.databaseService.query(query, values);
  }
  async findOneById(jobId: string) {
    const query = `SELECT * FROM jobs WHERE job_id = $1`;
    const job = (await this.databaseService.query(query, [jobId]))[0];
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async remove(jobId: string, userId: string) {
    const query = `DELETE FROM jobs WHERE job_id = $1 AND user_id = $2 RETURNING *`;
    const values = [jobId, userId];
    const job = (await this.databaseService.query(query, values))[0];
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
}
