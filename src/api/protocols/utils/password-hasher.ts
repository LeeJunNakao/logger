export interface PasswordHasher {
  hash: (password: string) => string,
}
