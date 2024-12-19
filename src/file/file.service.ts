import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }
}
