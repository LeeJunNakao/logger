export interface Encrypter {
  hash: (value: string) => Promise<string>,
  isValid: (unhashed: string, hash: string) => Promise<Boolean>,
}
