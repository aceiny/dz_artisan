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

      console.log("refresh token " , authHeader)
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Refresh' || !token) {
        throw new UnauthorizedException('Invalid refresh token format');
      }
      console.log("1")
      try {
        request.user = this.jwtService.verify(token, jwtRefreshConfig);
        console.log("2")
      } catch (err) {
        console.log("3")
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Refresh token expired');
        }
        console.log("4")
        throw new UnauthorizedException('Invalid refresh token');
      }
      console.log("5")

      return super.canActivate(context);
    }
  }