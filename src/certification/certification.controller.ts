import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer.config';
import { ParseFormDataInterceptor } from 'src/common/form-data.interceptor';

@ApiTags('Certification')
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor("attachment", MulterConfig),
    ParseFormDataInterceptor,
  )
  async create(
    @Body() createCertificationDto: CreateCertificationDto,
    @GetUser() user: jwtPayload,
    @UploadedFile() attachment : Express.Multer.File
  ) {
    console.log(attachment)
    const data = await this.certificationService.create(
      createCertificationDto,
      user,
    );
    return {
      message: 'Certification Created Successfully',
      status: HttpStatus.CREATED,
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.certificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.certificationService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
  ) {
    const data = await this.certificationService.update(
      +id,
      updateCertificationDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.certificationService.remove(+id);
  }
}
