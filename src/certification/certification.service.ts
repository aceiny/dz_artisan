import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { jwtPayload } from 'src/auth/types/payload.type';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CertificationService {
  constructor(private databaseService: DatabaseService) {}

  //certafication url is online
  async create(
    createCertificationDto: CreateCertificationDto,
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
      createCertificationDto.document_url,
    ];
    const certification = (await this.databaseService.query(query, values))[0];
    return certification;
  }

  async findAllByUserId(userId: string) {
    const query = `
    SELECT * FROM certifications WHERE user_id = $1
    `;
    const values = [userId];
    const certafications = await this.databaseService.query(query, values);
    return certafications;
  }

  async findOne(certificationId: string) {
    const query = `
    SELECT * FROM certifications WHERE certification_id  = $1  
    `;
    const values = [certificationId];
    const certafication = (await this.databaseService.query(query, values))[0];
    if (!certafication) {
      throw new NotFoundException('Certification Not Found');
    }
    return certafication;
  }

  async update(
    certificationId: string,
    userId: string,
    updateCertificationDto: UpdateCertificationDto,
  ) {
    const query = `
    UPDATE certifications SET name = $1, issuing_authority = $2, issue_date = $3, expiry_date = $4, document_url = $5
    WHERE certification_id = $6 AND user_id = $7
    RETURNING *
    `;
    const values = [
      updateCertificationDto.name,
      updateCertificationDto.issuing_authority,
      updateCertificationDto.issue_date,
      updateCertificationDto.expiry_date,
      updateCertificationDto.document_url,
      certificationId,
      userId,
    ];
    const certafication = (await this.databaseService.query(query, values))[0];
    if (!certafication) {
      throw new NotFoundException('Certification Not Found');
    }
    return certafication;
  }

  async remove(certificationId: string, userId: string) {
    const query = `
    DELETE FROM certifications WHERE certification_id = $1 AND user_id = $2
    RETURNING *
    `;
    const values = [certificationId, userId];
    const certification = (await this.databaseService.query(query, values))[0];
    if (!certification) {
      throw new NotFoundException('Certification Not Found');
    }
    return certification;
  }
}
