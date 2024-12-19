import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { jwtPayload } from 'src/auth/types/payload.type';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CertificationService {
  constructor(private databaseService: DatabaseService) {}

  //certafication url is online 
  async create(
    createCertificationDto: CreateCertificationDto,
    attachment: Express.Multer.File,
    user: jwtPayload,
  ) {
    if (
      new Date(createCertificationDto.issue_date) >=
      new Date(createCertificationDto.expiry_date)
    ) {
      throw new ConflictException('Issue Date must be less than Expiry Date');
    }
    const query = `
    INSERT INTO certifications (
    user_id , name, issuing_authority, issue_date , expiry_date , document_url
    ) VALUES ($1, $2, $3 , $4 , $5 , $6)
     RETURNING *
    `;
    const values = [
      user.id,
      createCertificationDto.name,
      createCertificationDto.issuing_authority,
      createCertificationDto.issue_date,
      createCertificationDto.expiry_date,
      `${process.env.BACKEND_URL}/uploads/${attachment.filename}`,
    ];
    const certification = (await this.databaseService.query(query, values))[0];
    return certification;
  }

  findAll() {
    return `This action returns all certification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certification`;
  }

  update(id: number, updateCertificationDto: UpdateCertificationDto) {
    return `This action updates a #${id} certification`;
  }

  remove(id: number) {
    return `This action removes a #${id} certification`;
  }
}
