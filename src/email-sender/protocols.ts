export interface O {[key: string]: any};

export interface HttpResponse {
  status: number,
  body: any,
}

export interface HttpClient {
  post: (data: O) => Promise<HttpResponse>,
}

export interface EmailSender {
  send: (email: string, subject: string, message: string) => Promise<Boolean>,
}
