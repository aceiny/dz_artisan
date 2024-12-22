import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './types/payload.type';
import { JwtConfig, JwtRefreshConfig } from 'src/config/jwt.config';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

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
        //domain: '.yxne.tech',
        path: '/',
      });
    }
    if (refresh_token) {
      response.cookie(process.env.JWT_REFRESH_COOKIE_NAME, refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        //domain: '.yxne.tech',
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
  async generateAccessToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtConfig);
  }

  async generateRefreshToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtRefreshConfig);
  }

  async validateUserWithGoogle(user: any) {
    const find_user_query = `SELECT * FROM users WHERE email = '${user.email}'`;
    const fetched_user = (await this.databaseService.query(find_user_query))[0];
    if (fetched_user) {
      return fetched_user;
    }
    const insert_user_query =
      'INSERT INTO users (full_name , email, password, phone_number, address , wilaya) VALUES ($1, $2, $3, $4, $5 , $6) RETURNING *';
    const random_password = this.generateRandomPassword();
    const random_password_hash = await bcrypt.hash(random_password, 12);
    const insert_user_values = [
      user.full_name,
      user.email,
      random_password_hash,
      '+213xxxxxxxxx',
      'Not Defined',
      'Not defined',
    ];
    const inserted_user = (
      await this.databaseService.query(insert_user_query, insert_user_values)
    )[0];
    return inserted_user;
  }
}
