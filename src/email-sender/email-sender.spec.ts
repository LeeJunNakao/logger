import { HttpClient as IHttpClient, HttpResponse, O } from './protocols';
import { EmailSender } from './email-sender';

class HttpClient implements IHttpClient {
  async post(data: O): Promise<HttpResponse> {
    return await new Promise(resolve => resolve({
      status: 200,
      body: {
        message: 'Email sent succesfully',
      },
    }));
  }
}

interface TypesSut {
  sut: EmailSender,
  httpClientSut: HttpClient,
}

const makeSut = (): TypesSut => {
  const httpClientSut = new HttpClient();
  const sut = new EmailSender(httpClientSut);

  return { sut, httpClientSut };
};

const emailData = {
  email: 'email@email.com',
  subject: 'Alter password',
  message: 'Your new password is 123456',
};

describe('Email sender', () => {
  test('Should throws if required fields are not provided', async() => {
    const { email, subject, message } = emailData;
    const { sut } = makeSut();
    let promise = sut.send('', subject, message);
    await expect(promise).rejects.toThrow();
    promise = sut.send(email, '', message);
    await expect(promise).rejects.toThrow();
    promise = sut.send(email, subject, '');
    await expect(promise).rejects.toThrow();
  });

  test('Should throws httpClient throws', async() => {
    const { email, subject, message } = emailData;
    const { sut, httpClientSut } = makeSut();
    jest.spyOn(httpClientSut, 'post').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.send(email, subject, message);
    await expect(promise).rejects.toThrow();
  });

  test('Should return false if httpClient status code is not 200', async() => {
    const { email, subject, message } = emailData;
    const { sut, httpClientSut } = makeSut();
    jest.spyOn(httpClientSut, 'post').mockReturnValueOnce(new Promise((resolve) => resolve({
      status: 400,
      body: { message: 'Failed to sent email' },
    })));
    const emailSent = await sut.send(email, subject, message);
    expect(emailSent).toBeFalsy();
  });

  test('Should call httpClient with correct params', async() => {
    const { email, subject, message } = emailData;
    const { sut, httpClientSut } = makeSut();
    const httpClientSpy = jest.spyOn(httpClientSut, 'post');
    await sut.send(email, subject, message);
    expect(httpClientSpy).toHaveBeenLastCalledWith({ to: email, subject, text: message });
  });

  test('Should return true if httpClient status code is 200', async() => {
    const { email, subject, message } = emailData;
    const { sut } = makeSut();
    const emailSent = await sut.send(email, subject, message);
    expect(emailSent).toBeTruthy();
  });
});
