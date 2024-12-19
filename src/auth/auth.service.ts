import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './types/payload.type';
import { jwtConfig, jwtRefreshConfig } from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateAccessToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, jwtConfig);
  }

  async generateRefreshToken(payload: jwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, jwtRefreshConfig);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        jwtRefreshConfig,
      );
      const accessToken = await this.generateAccessToken(payload);
      return accessToken;
    } catch (err) {
      console.log('refresh token error : ', err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
