import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { jwtPayload } from 'src/auth/types/payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Signup a new user',
    responses: {
      201: {
        description: 'User signed up successfully',
      },
      409: {
        description: 'Conflict , Email already exists',
      },
    },
  })
  @Post('/signup')
  async signup(@Body() signupUserDto: SignupUserDto) {
    const data = await this.userService.signup(signupUserDto);
    return {
      message: 'User signed up successfully',
      status: HttpStatus.CREATED,
      data,
    };
  }

  @ApiOperation({
    summary: 'Signin a user',
    responses: {
      200: {
        description: 'User signed in successfully',
      },
      401: {
        description: 'Unauthorized , Invalid credentials',
      },
    },
  })
  @Post('/signin')
  async signin(@Body() signinUserDto: SigninUserDto, @Req() req: Request) {
    const data = await this.userService.signin(signinUserDto, req);
    return {
      message: 'User signed in successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get all users',
    responses: {
      200: {
        description: 'Users Found',
      },
    },
  })
  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return {
      message: 'Users Found',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get loged in user profile by token',
    responses: {
      200: {
        description: 'User Found',
      },
      401: {
        description: 'Unauthorized , Invalid Token',
      },
    },
  })
  @ApiBearerAuth('Bearer')
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findUserProfile(@GetUser() user: jwtPayload) {
    const data = await this.userService.findOne(user.id);
    return {
      message: 'User Found',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get new access token by refresh token',
    responses: {
      200: {
        description: 'Token Refreshed',
      },
      401: {
        description: 'Unauthorized , Invalid Token',
      },
    },
  })
  @ApiBearerAuth('Refresh')
  @Get('/refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@GetUser() user: jwtPayload) {
    const data = await this.userService.refreshToken(user);
    return {
      message: 'Token Refreshed',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get user by id',
    responses: {
      200: {
        description: 'User Found',
      },
      404: {
        description: 'User not found',
      },
    },
  })
  @ApiParam({
    name: 'userId',
    description: 'User Id',
    example: 'e3b8a9b4-4b0e-4f9b-9c3d-0a8e4f9b2c3d',
    required: true,
  })
  @Get('/:userId')
  async findOne(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const data = await this.userService.findOne(userId);
    return {
      message: 'User Found',
      status: HttpStatus.OK,
      data,
    };
  }
}
