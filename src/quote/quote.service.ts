import { Injectable } from '@nestjs/common';
import { CreateQuoteDto, CreateQuoteRequestDto } from './dto/create-quote.dto';
import { DatabaseService } from 'src/database/database.service';
@Injectable()
export class QuoteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createQuoteRequest(createQuoteRequestDto: CreateQuoteRequestDto , clientId : string) {
    const query = `
      INSERT INTO quote_requests (job_id, client_id, preferred_date, note)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      createQuoteRequestDto.job_id,
      clientId, 
      createQuoteRequestDto.preferred_date,
      createQuoteRequestDto.note
    ];
    return (await this.databaseService.query(query, values))[0];
  }

  async createQuote(createQuoteDto: CreateQuoteDto, artisanId: string) {
    const query = `
      INSERT INTO quotes (request_id, user_id, amount, description, validity_period)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      createQuoteDto.request_id,
      artisanId,
      createQuoteDto.amount,
      createQuoteDto.description,
      createQuoteDto.validity_period
    ];
    return (await this.databaseService.query(query, values))[0];
  }

  async getQuoteRequestsByJob(jobId: string) {
    const query = `SELECT * FROM quote_requests WHERE job_id = $1`;
    return this.databaseService.query(query, [jobId]);
  }

  async getQuotesByRequest(requestId: string) {
    const query = `SELECT * FROM quotes WHERE request_id = $1`;
    return this.databaseService.query(query, [requestId]);
  }

  async updateQuoteStatus(quoteId: string, status: 'accepted' | 'rejected') {
    const query = `
      UPDATE quotes 
      SET status = $1
      WHERE quote_id = $2
      RETURNING *
    `;
    // if accepted create a new chat between client and artisan , if rejected do nothing
    return (await this.databaseService.query(query, [status, quoteId]))[0];
  }
}