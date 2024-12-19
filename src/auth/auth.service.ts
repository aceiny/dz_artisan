import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './types/payload.type';
import { JwtConfig, JwtRefreshConfig } from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateAccessToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtConfig);
  }

  async generateRefreshToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, JwtRefreshConfig);
  }
}
