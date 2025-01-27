import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig, JwtRefreshConfig } from 'src/config/jwt.config';
import { Request, Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole } from 'src/user/dto/user.schema';
import { JwtPayload } from './types/payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  private readonly allowed_routes = [
    { url: /^\/user\/complete-profile$/, method: 'POST' },
    { url: /^\/user\/artisan$/, method: 'POST' },
    ,
  ];

  private generateRandomPassword(length: number = 16): string {
    return (
      crypto
        .randomBytes(length)
        .toString('base64')
        .slice(0, length)
        .replace(/[+/=]/g, '') + // Remove special chars
      crypto.randomInt(0, 9)
    ); // Ensure at least one number
  }
  async setCookies(
    response: Response,
    access_token?: string,
    refresh_token?: string,
  ) {
    if (access_token) {
      response.cookie(process.env.JWT_COOKIE_NAME, access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.yxne.tech',
        path: '/',
      });
    }
    if (refresh_token) {
      response.cookie(process.env.JWT_REFRESH_COOKIE_NAME, refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.yxne.tech',
        path: '/',
      });
    }
    return true;
  }
  async clearCookies(response: Response) {
    response.clearCookie(process.env.JWT_COOKIE_NAME);
    response.clearCookie(process.env.JWT_REFRESH_COOKIE_NAME);
    return true;
  }
  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtConfig);
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtRefreshConfig);
  }

  async checkUserArtisanProfileExists(userId: string) {
    const query = `
    SELECT 
      *
    FROM artisan_portfolios 
    WHERE user_id = $1
    `;
    const values = [userId];
    const user = (await this.databaseService.query(query, values))[0];
    if (!user) return false;
    return true;
  }

  async findUser(userId: string, req: Request): Promise<User> {
    const query = `
      SELECT 
        *
      FROM user_info 
      WHERE user_id = $1
      `;
    const values = [userId];
    const user: User = (await this.databaseService.query(query, values))[0];
    if (!user) throw new ConflictException('User Not Found');
    console.log(req.path);
    const is_allowed_route = this.allowed_routes.some(
      (route) => route.url.test(req.path) && req.method === route.method,
    );

    if (is_allowed_route) return user;
    if (!user.username) throw new BadRequestException('User Profile Not set');
    if (
      user.role === UserRole.ARTISAN &&
      !(await this.checkUserArtisanProfileExists(userId))
    ) {
      throw new BadRequestException('Artisan Profile Not set');
    }
    return user;
  }
  async validateUserWithGoogle(user: any) {
    const find_user_query = `SELECT * FROM users WHERE email = '${user.email}'`;
    const fetched_user = (await this.databaseService.query(find_user_query))[0];
    if (fetched_user) {
      return fetched_user;
    }
    const insert_user_query =
      'INSERT INTO users (full_name , email, password, email_verfied) VALUES ($1, $2, $3, $4,) RETURNING *';
    const random_password = this.generateRandomPassword();
    const random_password_hash = await bcrypt.hash(random_password, 12);
    const insert_user_values = [
      user.full_name,
      user.email,
      random_password_hash,
      true,
    ];
    const inserted_user = (
      await this.databaseService.query(insert_user_query, insert_user_values)
    )[0];
    return inserted_user;
  }
}
