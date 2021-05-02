import { EmailValidator } from '../protocols/validators';
import validator from 'validator';

export class EmailValidatorAdapter implements EmailValidator {
  validate(email: string): Boolean {
    return validator.isEmail(email);
  }
}
