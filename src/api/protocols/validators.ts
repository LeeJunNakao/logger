export interface EmailValidator {
  validate: (email: string) => Boolean,
}

export interface PasswordValidator {
  validate: (password: string) => Boolean,
}
