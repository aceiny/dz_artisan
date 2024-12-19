import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { JwtService } from '@nestjs/jwt';
import { jwtRefreshConfig } from 'src/config/jwt.config';
  
  @Injectable()
  export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
    constructor(private readonly jwtService: JwtService) {
      super();
    }
  
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        throw new UnauthorizedException('Refresh token not found');
      }
  
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid refresh token format');
      }
  
      try {
        request.user = this.jwtService.verify(token, jwtRefreshConfig);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Refresh token expired');
        }
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      return super.canActivate(context);
    }
  }