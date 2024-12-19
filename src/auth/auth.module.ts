import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports : [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({}),
  ],
  providers: [AuthService , JwtStrategy , RolesGuard],
  exports : [JwtStrategy , PassportModule , RolesGuard , JwtModule , AuthService]
})
export class AuthModule {}
