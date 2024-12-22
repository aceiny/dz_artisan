import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshConfig } from 'src/config/jwt.config';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies[process.env.JWT_REFRESH_COOKIE_NAME]; // Replace 'jwt' with your cookie name
    if (!token) {
      throw new UnauthorizedException('JWT cookie not found');
    }
    try {
      request.user = this.jwtService.verify(token, JwtRefreshConfig);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }

      throw new UnauthorizedException('Invalid refresh token');
    }

    return super.canActivate(context);
  }
}
