import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mail_from = `Dz Artisan <no-reply@dz-artisan.com>`;
  constructor() {
    this.transporter = nodemailer.createTransport({
      /*
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            */
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendMail(sendMailDto: SendMailDto): Promise<boolean> {
    const data = {
      from: this.mail_from,
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.text,
    };

    try {
      const info = await this.transporter.sendMail(data);
      return true;
    } catch (error) {
      console.log('Failed to send email');
      return null;
    }
  }
  async sendWelcomeMail(sendMailDto: SendMailDto): Promise<boolean> {
    const mailOptions = {
      from: this.mail_from,
      to: sendMailDto.to,
      subject: 'Welcome to DZ-Artisan!',
      html: this.welcomeMailTemplate(sendMailDto.data),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log('Failed to send email');
      return null;
    }
  }
  async sendNewLoginMail(sendMailDto: SendMailDto): Promise<boolean> {
    const mailOptions = {
      from: this.mail_from,
      to: sendMailDto.to,
      subject: 'New Login Attempt Detected',
      html: this.newLoginMailTemplate(sendMailDto.data),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log('Failed to send email');
      return null;
    }
  }
  welcomeMailTemplate(sendMailDto: SendMailDto['data']) {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to DZ-Artisan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #0056b3;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .content h2 {
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0056b3;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background-color: #f1f1f1;
            color: #777;
            padding: 10px;
            text-align: center;
            font-size: 14px;
        }
        .footer a {
            color: #0056b3;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to DZ-Artisan!</h1>
        </div>
        <div class="content">
            <h2>Hello ${sendMailDto.name},</h2>
            <p>We are thrilled to have you join our platform. DZ-Artisan is your trusted space to connect with skilled professionals and artisans for all your project needs.</p>
            <p>Here's what you can do with DZ-Artisan:</p>
            <ul>
                <li><strong>For Clients:</strong> Find qualified artisans, request quotes, and track your projects effortlessly.</li>
                <li><strong>For Artisans:</strong> Showcase your portfolio, manage jobs, and grow your business.</li>
            </ul>
            <p>Get started by exploring our platform:</p>
            <a href="dz-artisan.com" class="button">Visit DZ-Artisan</a>
            <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@dz-artisan.com">support@dz-artisan.com</a>.</p>
            <p>Thank you for choosing DZ-Artisan. We're excited to help you achieve your goals!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DZ-Artisan. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/privacy-policy">Privacy Policy</a> | <a href="${process.env.FRONTEND_URL}/terms">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>

        `;
  }
  newLoginMailTemplate(sendMailDto: SendMailDto['data']) {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Login Attempt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #ff9800;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .content h2 {
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ff9800;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            background-color: #f1f1f1;
            color: #777;
            padding: 10px;
            text-align: center;
            font-size: 14px;
        }
        .footer a {
            color: #ff9800;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Login Attempt Detected</h1>
        </div>
        <div class="content">
            <h2>Hello ${sendMailDto.name},</h2>
            <p>We detected a new login attempt to your DZ-Artisan account. Below are the details:</p>
            <ul>
                <li><strong>Date & Time:</strong> ${sendMailDto.date}</li>
                <li><strong>Device:</strong> ${sendMailDto.device}</li>
                <li><strong>Location:</strong> ${sendMailDto.location}</li>
                <li><strong>IP Address:</strong> ${sendMailDto.ip_address}</li>
            </ul>
            <p>If this was you, no further action is needed. However, if you did not initiate this login attempt, we recommend taking the following steps immediately:</p>
            <ol>
                <li>Change your account password.</li>
                <li>Enable two-factor authentication (if not already enabled).</li>
                <li>Contact our support team at <a href="mailto:support@dz-artisan.com">support@dz-artisan.com</a> if you suspect unauthorized access.</li>
            </ol>
            <p>To secure your account, click the button below to change your password:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password" class="button">Change Password</a>
            <p>Your security is our priority. Please do not hesitate to reach out if you have any concerns.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 DZ-Artisan. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/privacy-policy">Privacy Policy</a> | <a href="${process.env.FRONTEND_URL}/terms">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>

        `;
  }
}
