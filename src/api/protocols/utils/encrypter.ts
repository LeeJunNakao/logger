export interface Encrypter {
  hash: (value: string) => string,
}
