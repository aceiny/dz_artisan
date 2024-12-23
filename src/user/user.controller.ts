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
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/types/payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './dto/user.schema';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer.config';
import { ParseFormDataInterceptor } from 'src/common/form-data.interceptor';
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
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupUserDto: SignupUserDto,
  ) {
    const data = await this.userService.signup(signupUserDto, res);
    return {
      message: 'User signed up successfully',
      status: HttpStatus.CREATED,
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
  async signin(
    @Body() signinUserDto: SigninUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.signin(signinUserDto, req, res);
    return {
      message: 'User signed in successfully',
      status: HttpStatus.OK,
    };
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // This route will redirect to Google's OAuth 2.0 server
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @GetUser() user: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.userService.validateGoogleAuth(user, res);
    return res.redirect(process.env.FRONTEND_URL);
  }

  @ApiOperation({
    summary:
      'Complete user profile , form data , will add profile picture if provided otherwise will keep it to null',
    responses: {
      200: {
        description: 'User profile completed',
      },
      401: {
        description: 'Unauthorized , Invalid Token',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/complete-profile')
  @UseInterceptors(
    FileInterceptor('profile_picture', MulterConfig),
    ParseFormDataInterceptor,
  )
  async completeUserProfile(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @UploadedFile() profile_picture: Express.Multer.File,
    @GetUser() user: any,
  ) {
    const data = await this.userService.completeUserProfile(
      user.user_id,
      createUserProfileDto,
      profile_picture,
    );
    return {
      message: 'User profile completed',
      status: HttpStatus.OK,
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
  async findUserProfile(@GetUser() user: User) {
    const data = user;
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
  async refreshToken(
    @GetUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.userService.refreshToken(user, res);
    return {
      message: 'Token Refreshed',
      status: HttpStatus.OK,
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
