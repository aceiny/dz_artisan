import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './types/payload.type';
import { JwtConfig, JwtRefreshConfig } from 'src/config/jwt.config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async setCookies(response: Response, access_token?: string, refresh_token?: string) {
    if(access_token) {
      response.cookie(process.env.JWT_COOKIE_NAME, access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        //domain: '.yxne.tech',
        path: '/',
      });
    }
    if(refresh_token) {
      response.cookie(process.env.JWT_REFRESH_COOKIE_NAME, refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        //domain: '.yxne.tech',
        path: '/',
      });
    }
    return true
  }
  async clearCookies(response: Response) {
    response.clearCookie(process.env.JWT_COOKIE_NAME);
    response.clearCookie(process.env.JWT_REFRESH_COOKIE_NAME);
    return true
  }
  async generateAccessToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtConfig);
  }

  async generateRefreshToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtRefreshConfig);
  }
}
