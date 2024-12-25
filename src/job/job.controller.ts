import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User, UserRole } from 'src/user/dto/user.schema';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer.config';
import { ParseFormDataInterceptor } from 'src/common/form-data.interceptor';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ApiOperation({
    summary: 'Create a new job',
    description: 'Create a new job by artisan',
    responses: {
      201: {
        description: 'Job created successfully',
      },
      400: {
        description:
          'user is not an artisan or upload at least one attachment related to this job',
      },
      others: {
        description: 'cant upload more then 10 files',
      },
    },
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('attachments', 10, MulterConfig),
    ParseFormDataInterceptor,
  )
  async create(
    @Body() createJobDto: CreateJobDto,
    @GetUser() user: User,
    @UploadedFiles() attachments: Express.Multer.File[],
  ) {
    console.log('hi from');
    if (user.role != UserRole.ARTISAN) {
      throw new BadRequestException('user is not an artisan');
    }
    if (attachments.length == 0) {
      throw new BadRequestException(
        'upload at least one attachment related to this job',
      );
    }
    createJobDto.attachments = attachments;
    console.log(createJobDto);
    const data = await this.jobService.create(createJobDto, user.user_id);
    return {
      message: 'Job created successfully',
    };
  }

  @ApiOperation({
    summary: 'Get all jobs created by artisan',
    description: 'Get all jobs created by artisan',
    responses: {
      200: {
        description: 'All jobs created by artisan',
      },
    },
  })
  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async findAllJobCreatedByArtisan(@GetUser() user: User) {
    const data = await this.jobService.findAllJobCreatedByArtisan(user.user_id);
    return {
      message: 'All jobs created by artisan',
      status: 200,
      data,
    };
  }

  @ApiOperation({
    summary: 'search all jobs and search in them by query',
    description: 'Get all jobs',
    responses: {
      200: {
        description: 'All jobs',
      },
    },
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'job_type', required: false })
  @ApiQuery({ name: 'minimum_price', required: false })
  @ApiQuery({ name: 'tags', required: false })
  @Get('/')
  async findJobByQueries(
    @Query('title') title: string,
    @Query('location') location: string,
    @Query('job_type') job_type: string,
    @Query('minimum_price') minimum_price: number,
    @Query('tags') tags: string,
  ) {
    const data = await this.jobService.findJobByQueries(
      title,
      location,
      job_type,
      minimum_price,
      tags,
    );
    return {
      message: 'Jobs Found',
      status: 200,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get a job by id',
    description: 'Get a job by id',
    responses: {
      200: {
        description: 'Job Found',
      },
      404: {
        description: 'Job not found',
      },
    },
  })
  @Get('/:jobId')
  async findOne(@Param('jobId', new ParseUUIDPipe()) jobId: string) {
    const data = await this.jobService.findOneById(jobId);
    return {
      message: 'Job Found',
      status: 200,
      data,
    };
  }

  @ApiOperation({
    summary: 'Delete a job by id',
    description: 'Delete a job by id',
    responses: {
      200: {
        description: 'Job Deleted',
      },
      404: {
        description: 'Job not found or user is not the owner of this job',
      },
    },
  })
  @Delete('/:jobId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('jobId', new ParseUUIDPipe()) jobId: string,
    @GetUser() user: User,
  ) {
    const data = await this.jobService.remove(jobId, user.user_id);
    return {
      message: 'Job Deleted',
      status: 200,
    };
  }
}
