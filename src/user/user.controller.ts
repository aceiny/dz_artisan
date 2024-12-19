import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    const data = await this.userService.signup(signupUserDto);
    return {
      message : "User signed up successfully",
      status : HttpStatus.CREATED,
      data
    }
  }
  @Post('/signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    const data = await this.userService.signin(signinUserDto);
    return {
      message : "User signed in successfully",
      status : HttpStatus.OK,
      data
    }
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
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findUserProfile(@GetUser() user : jwtPayload) {
    console.log(user)
    const data = await this.userService.findOne(user.id);
    return {
      message: 'User Found',
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
