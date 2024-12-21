import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/jwt.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-access') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies[process.env.JWT_COOKIE_NAME]; // Replace 'jwt' with your cookie name
    console.log(token)
    if (!token) {
      throw new UnauthorizedException('JWT cookie not found');
    }
    try {
      request.user = this.jwtService.verify(token, JwtConfig); // jwt config
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token is expired');
      }
      throw new UnauthorizedException('Token is invalid');
    }

    return super.canActivate(context);
  }
}
