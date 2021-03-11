import { load, IsString } from 'type-dotenv';

class Environment {
  @IsString()
  JWT_KEY: string;
}

export const env = load(Environment);
