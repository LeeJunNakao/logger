export class InvalidTokenError extends Error {
  constructor() {
    super('Token is invalid');
    this.name = 'InvalidTokenError';
    this.message = 'Token is invalid';
  }
}
