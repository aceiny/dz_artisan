import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mail/mail.service';

@Processor('email-queue')
export class EmailQueueProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('welcome-email')
  async handleWelcomeEmail(job: Job) {
    console.log('Processing welcome email job' , job.data);
    const { mailDto } = job.data;
    await this.mailService.sendWelcomeMail(mailDto);
  }
  @Process('new-login')
  async handleNewLogin(job: Job) {
    const { mailDto } = job.data;
    await this.mailService.sendNewLoginMail(mailDto);
  }
}
