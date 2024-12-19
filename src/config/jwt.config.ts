import { JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtSignOptions = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE_IN,
};

export const jwtRefreshConfig: JwtSignOptions = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
};
