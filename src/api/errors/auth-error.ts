export class AuthError extends Error {
  constructor() {
    super('Combination email and password is not valid');
    this.name = 'AuthError';
    this.message = 'Combination email and password is not valid';
  }
}
