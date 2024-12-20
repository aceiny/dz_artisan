import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Certification')
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @ApiOperation({
    summary: 'Create a new certification',
    description:
      'This will create a new certification for the user (form data) ',
    responses : {
      201 : {
        description : 'Certification Created Successfully'
      },
      409 : {
        description : 'Issue Date must be less than Expiry Date'
      }
    }
  })
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
    };
  }

  @ApiOperation({
    summary: 'Find all certifications',
    description: 'This will return all certifications for the logged in user',
    responses : {
      200 : {
        description : 'Certifications Fetched Successfully'
      },
    }
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByUserId(@GetUser() user: jwtPayload) {
    const data = await this.certificationService.findAllByUserId(user.id);
    return {
      message :'Certifications Fetched Successfully',
      status : HttpStatus.OK,
      data
    }
  }

  @ApiOperation({
    summary: 'Find a certification by ID',
    description: 'This will return a certification by ID for the logged in user',
    responses : {
      200 : {
        description : 'Certification Fetched Successfully'
      },
      404 : {
        description : 'Certification Not Found'
      }
    }
  })
  @Get('/:certificationId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('certificationId' , new ParseUUIDPipe()) certificationId: string , @GetUser() user: jwtPayload) {
    const data = await this.certificationService.findOne(certificationId);
    return {
      message: 'Certification Fetched Successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Update a certification',
    description: 'This will update a certification by ID for the logged in user',
    responses : {
      200 : {
        description : 'Certification Updated Successfully'
      },
      404 : {
        description : 'Certification Not Found Or Not Belongs to User'
      }
    }
  })
  @Put(':certificationId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('certificationId' , new ParseUUIDPipe()) certificationId: string,
    @Body() updateCertificationDto: UpdateCertificationDto,
    @GetUser() user: jwtPayload
  ) {
    const data = await this.certificationService.update(
      certificationId,
      user.id,
      updateCertificationDto,
    );
    return {
      message: 'Certification Updated Successfully',
      status: HttpStatus.OK,
      data,
    }
  }

  @ApiOperation({
    summary: 'Delete a certification',
    description: 'This will delete a certification by ID for the logged in user',
    responses : {
      200 : {
        description : 'Certification Deleted Successfully'
      },
      404 : {
        description : 'Certification Not Found Or Not Belongs to User'
      }
    }
  })
  @Delete(':certificationId')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('certificationId' , new ParseUUIDPipe()) certificationId: string , @GetUser() user: jwtPayload) {
    const data = await this.certificationService.remove(certificationId , user.id);
    return {
      message: 'Certification Deleted Successfully',
      status: HttpStatus.OK,
      data,
    }
  }
}
