import { PasswordValidator } from './protocols/validators';
import validator from 'validator';

export class PasswordValidatorAdapter implements PasswordValidator {
  validate(password: string): Boolean {
    return validator.isStrongPassword(password);
  }
}
