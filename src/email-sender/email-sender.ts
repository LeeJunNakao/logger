import { EmailSender as IEmailSender } from 'src/email-sender/protocols';
import { HttpClient } from './protocols';

export class EmailSender implements IEmailSender {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async send(email: string, subject: string, message: string): Promise<Boolean> {
    if (!email || !subject || !message) throw new Error();
    const response = await this.httpClient.post({ to: email, subject, text: message });
    return response.status === 200;
  }
}
