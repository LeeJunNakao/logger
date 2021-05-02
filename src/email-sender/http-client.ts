import { HttpClient as IHttpClient, O, HttpResponse } from './protocols';
import axios, { AxiosInstance } from 'axios';
import { env } from './config';

const client = axios.create({
  baseURL: env.URL,
  headers: {
    secret_key: env.SECRET_KEY,
  },
});

export class HttpClient implements IHttpClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = client;
  }

  async post(data: O): Promise<HttpResponse> {
    const response = await this.client.post('', data);
    return {
      status: response.status,
      body: response.data,
    };
  }
}
