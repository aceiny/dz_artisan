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
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Certification')
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createCertificationDto: CreateCertificationDto,
    @GetUser() user: jwtPayload,
  ) {
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
