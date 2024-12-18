import { ClientConfig } from 'pg';

import * as dotenv from 'dotenv';

dotenv.config();
export const pgPoolConfig: ClientConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
