import { PartialType } from '@nestjs/swagger';
import { SignupUserDto } from './signup-user.dto';

export class UpdateUserDto extends PartialType(SignupUserDto) {}
