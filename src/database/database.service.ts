// src/database/database.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { PgPoolConfig } from 'src/config/database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor() {
    this.client = new Client(PgPoolConfig);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async query(queryText: string, params: any[] = []) {
    const result = await this.client.query(queryText, params);
    return result.rows;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
