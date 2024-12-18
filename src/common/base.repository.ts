import { Pool } from 'pg';

export abstract class BaseRepository {
  constructor(protected readonly pool: Pool) {}

  protected async executeQuery(query: string, params?: any[]) {
    try {
      const { rows } = await this.pool.query(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}
