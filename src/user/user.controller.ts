import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.userService.signup(signupUserDto);
  }
  @Post('/signin')
  signin(@Body() signinUserDto: SigninUserDto) {
    return this.userService.signin(signinUserDto);
  }

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      message: 'Users Found',
      status: HttpStatus.OK,
      data,
    };
  }

  @Get(':userId')
  async findOne(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const data = await this.userService.findOne(userId);
    return {
      message: 'User Found',
      status: HttpStatus.OK,
      data,
    };
  }
}
