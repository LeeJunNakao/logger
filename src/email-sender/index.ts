import { EmailSender } from './email-sender';
import { HttpClient } from './http-client';

export const makeEmailSenderAdapter = (): EmailSender => {
  const httpClient = new HttpClient();
  const emailSender = new EmailSender(httpClient);
  return emailSender;
};
