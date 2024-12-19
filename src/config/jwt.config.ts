import { JwtSignOptions } from '@nestjs/jwt';

export const JwtConfig: JwtSignOptions = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE_IN,
};

export const JwtRefreshConfig: JwtSignOptions = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
};
