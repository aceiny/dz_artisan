import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtConfig, JwtRefreshConfig } from 'src/config/jwt.config';
import { AuthService } from '../auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const token = this.extractTokenFromCookie(client, process.env.JWT_COOKIE_NAME);
      const refreshToken = this.extractTokenFromCookie(client, process.env.JWT_REFRESH_COOKIE_NAME);

      if (!token) {
        throw new WsException('Unauthorized - No token');
      }

      try {
        const payload = this.jwtService.verify(token, JwtConfig);
        context.switchToWs().getData().user = payload;
        return true;
      } catch (err) {
        if (err.name === 'TokenExpiredError' && refreshToken) {
          try {
            const refreshPayload = this.jwtService.verify(refreshToken, JwtRefreshConfig);
            const newAccessToken = await this.authService.generateAccessToken({
              id: refreshPayload.id,
              role: refreshPayload.role,
            });
            
            // Send new access token to client
            client.emit('token:refresh', { token: newAccessToken });
            
            context.switchToWs().getData().user = refreshPayload;
            return true;
          } catch {
            throw new WsException('Refresh token invalid');
          }
        }
        throw new WsException('Token invalid');
      }
    } catch (error) {
      throw new WsException(error.message || 'Unauthorized');
    }
  }

  private extractTokenFromCookie(client: Socket, cookieName: string): string | undefined {
    const cookies = client.handshake.headers.cookie?.split(';')
      .reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
    
    return cookies?.[cookieName];
  }
}