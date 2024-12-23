import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/types/payload.type';
import { MailService } from 'src/mail/mail.service';
import { Request, Response } from 'express';
import { SendMailDto } from 'src/mail/dto/send-mail.dto';
import * as requestIp from 'request-ip';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}
  async checkUserExistsByEmail(email: string): Promise<boolean> {
    if (!email) throw new ConflictException('No Email Provided');
    const query = 'SELECT email FROM users WHERE email = $1';
    const values = [email];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) return false;
    return true;
  }
  async checkUserExistsByUsername(username: string): Promise<boolean> {
    if (!username) throw new ConflictException('No Username Provided');
    const query = 'SELECT username FROM users WHERE username = $1';
    const values = [username];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) return false;
    return true;
  }
  async findUserByEmail(email: string) {
    if (!email) throw new ConflictException('No Email Provided');
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) throw new ConflictException('Invalid Credentials');
    return user[0];
  }
  async findAll() {
    const query = `
    SELECT 
      *
    FROM user_info 
    `;
    const users = await this.databaseService.query(query);
    return users;
  }
  async signup(signupUserDto: SignupUserDto, res: Response) {
    if (await this.checkUserExistsByEmail(signupUserDto.email))
      throw new ConflictException('Email Already Taken');
    const query =
      'INSERT INTO users (full_name , email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const hash_salt = 12;
    const password_hash = await bcrypt.hash(signupUserDto.password, hash_salt);
    const values = [
      signupUserDto.full_name,
      signupUserDto.email,
      password_hash,
      signupUserDto.role,
    ];
    const user = (await this.databaseService.query(query, values))[0];
    if (!user) throw new ConflictException('User not created');
    const mailDto = {
      to: user.email,
      subject: 'Welcome to DZ-Artisan!',
      text: 'Welcome to DZ-Artisan!',
      data: {
        name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
      },
    };
    await this.mailService.sendWelcomeMail(mailDto);
    const access_token = await this.authService.generateAccessToken({
      id: user.user_id,
      role: user.role,
    });
    const refresh_token = await this.authService.generateRefreshToken({
      id: user.user_id,
      role: user.role,
    });
    this.authService.setCookies(res, access_token, refresh_token);
    return true;
  }

  async signin(signinUserDto: SigninUserDto, req: Request, res: Response) {
    const user = await this.findUserByEmail(signinUserDto.email);
    const password = user.password;
    const is_match = await bcrypt.compare(signinUserDto.password, password);
    if (!is_match) throw new ConflictException('Invalid Credentials');

    // Extract IP address and device information
    const ip_address = requestIp.getClientIp(req);
    const device = req.headers['user-agent'];

    // Send New Login Mail
    const mailDto: SendMailDto = {
      to: user.email,
      subject: 'New Login Detected',
      text: 'New Login Detected',
      data: {
        name: user.full_name,
        date: new Date().toISOString(),
        device: device,
        location: ip_address, // Placeholder for location
        ip_address: ip_address,
      },
    };
    await this.mailService.sendNewLoginMail(mailDto);
    const access_token = await this.authService.generateAccessToken({
      id: user.user_id,
      role: user.role,
    });
    const refresh_token = await this.authService.generateRefreshToken({
      id: user.user_id,
      role: user.role,
    });
    this.authService.setCookies(res, access_token, refresh_token);
    return true;
  }

  async validateGoogleAuth(user: any, res: Response) {
    const access_token = await this.authService.generateAccessToken({
      id: user.user_id,
      role: user.role,
    });
    const refresh_token = await this.authService.generateRefreshToken({
      id: user.user_id,
      role: user.role,
    });
    this.authService.setCookies(res, access_token, refresh_token);
    return true;
  }

  async completeUserProfile(
    userId: string,
    createUserProfileDto: CreateUserProfileDto,
    profile_picture?: Express.Multer.File,
  ) {
    if (await this.checkUserExistsByUsername(createUserProfileDto.username)) {
      throw new ConflictException('Username already taken');
    }

    const query = profile_picture
      ? `
        UPDATE users SET 
            username = $1,
            birthday = $2,
            employment_status = $3,
            bio = $4,
            profile_picture = $5
        WHERE user_id = $6
        RETURNING *
        `
      : `
        UPDATE users SET 
            username = $1,
            birthday = $2,
            employment_status = $3,
            bio = $4
        WHERE user_id = $5
        RETURNING *
        `;
    const values = profile_picture
      ? [
          createUserProfileDto.username,
          createUserProfileDto.birthday,
          createUserProfileDto.employment_status,
          createUserProfileDto.bio || null,
          `${process.env.BACKEND_URL}/uploads/${profile_picture.filename}`,
          userId,
        ]
      : [
          createUserProfileDto.username,
          createUserProfileDto.birthday,
          createUserProfileDto.employment_status,
          createUserProfileDto.bio || null,
          userId,
        ];
    const user = (await this.databaseService.query(query, values))[0];
    if (!user) throw new ConflictException('User Profile not updated');
    return user;
  }
  async findOne(userId: string) {
    const query = `
    SELECT 
      *
    FROM user_info 
    WHERE user_id = $1
    `;
    const values = [userId];
    const user = await this.databaseService.query(query, values);
    if (user.length === 0) throw new ConflictException('User Not Found');
    return user[0];
  }
  async refreshToken(payload: JwtPayload, res: Response) {
    const new_access_token = await this.authService.generateAccessToken({
      id: payload.id,
      role: payload.role,
    });
    this.authService.setCookies(res, new_access_token);
    return true;
  }
}
