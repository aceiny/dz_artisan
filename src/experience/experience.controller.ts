import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer.config';
import { ParseFormDataInterceptor } from 'src/common/form-data.interceptor';
import { ApiOperation } from '@nestjs/swagger';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @ApiOperation({
    summary: 'Create a new experience',
    description:
      'This will create a new experience for the user (form data) ',
    responses: {
      201: {
        description: 'Experience Created Successfully',
      },
    },
  })
  @Post()
  @UseInterceptors(
    FilesInterceptor('attachments', 10, MulterConfig),
    ParseFormDataInterceptor,
  )
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createExperienceDto: CreateExperienceDto,
    @UploadedFiles() attachments: Express.Multer.File[],
    @GetUser() user: jwtPayload,
  ) {
    const data = await this.experienceService.create(
      createExperienceDto,
      attachments,
      user.id,
    );
    return {
      message: 'Experience Created Successfully',
      status: HttpStatus.CREATED,
    };
  }

  @ApiOperation({
    summary: 'Get all experiences',
    description: 'Get all experiences for logged in user',
    responses: {
      201: {
        description: 'Experiences Fetched Successfully',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByUserId(@GetUser() user: jwtPayload) {
    const data = await this.experienceService.findAllByUserId(user.id);
    return {
      message: 'Experiences Fetched Successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get experience by ID',
    description: 'Get single experience by ID',
    responses: {
      200: {
        description: 'Experience Fetched Successfully',
      },
      404: {
        description: 'Experience Not Found',
      },
    },
  })
  @Get('/:experienceId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('experienceId', new ParseUUIDPipe()) experienceId: string,
  ) {
    const data = await this.experienceService.findOne(experienceId);
    return {
      message: 'Experience Fetched Successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Update experience',
    description: 'Update experience by ID',
     responses: {
      200: {
        description: 'Experience Updated Successfully',
      },
      404: {
        description: 'Experience Not Found Or Not Belongs to User',
      },
    },
  })
  @Put('/:experienceId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('experienceId', new ParseUUIDPipe()) experienceId: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @GetUser() user: jwtPayload,
  ) {
    const data = await this.experienceService.update(
      experienceId,
      user.id,
      updateExperienceDto,
    );
    return {
      message: 'Experience Updated Successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Delete experience',
    description: 'Delete experience by ID',
    responses: {
      200: {
        description: 'Experience Deleted Successfully',
      },
      404: {
        description: 'Experience Not Found Or Not Belongs to User',
      },
  }})
  @Delete(':experienceId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('experienceId', new ParseUUIDPipe()) experienceId: string,
    @GetUser() user: jwtPayload,
  ) {
    const data = await this.experienceService.remove(experienceId, user.id);
    return {
      message: 'Experience Deleted Successfully',
      status: HttpStatus.OK,
      data,
    };
  }
}
