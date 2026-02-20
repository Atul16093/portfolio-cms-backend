import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');

    // Using mock credentials if not provided (as per user request "currelt u used moc creds")
    if (!user || !pass) {
      console.log("Using mock creds ")
      this.logger.warn('SMTP credentials not provided. Using Ethereal (mock) for testing.');
      nodemailer.createTestAccount().then((account) => {
        this.transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
        this.logger.log(`Mock Mail Transporter created: ${account.user}`);
      }).catch(err => {
         this.logger.error('Failed to create mock account', err);
      });
      return;
    }
    console.log("Using real creds ")

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    }); 
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
        // Retry creation or just wait if it's initializing mock
        // For simplicity, if mock is initializing, we might fail or wait. 
        // In production with real creds, this won't be async.
        this.logger.warn('Transporter not ready yet.');
    }

    const from = this.configService.get<string>('mail.from');
    
    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      console.log("Mail sent", info);
      this.logger.log(`Message sent: ${info.messageId}`);
      
      // If using Ethereal, log the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Preview URL: ${previewUrl}`);
      }
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }

  async sendNewContactNotification(contact: { name: string; email: string; message: string }) {
      const adminEmail = this.configService.get<string>('mail.to');
      if (!adminEmail) {
          this.logger.warn('No admin email configured (MAIL_TO). Skipping notification.');
          return;
      }
      
      const subject = `New Contact Request from ${contact.name}`;
      const html = `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
        <br>
        <p><em>Sent from Portfolio Contact Form</em></p>
      `;

      await this.sendMail(adminEmail, subject, html);
  }
}
