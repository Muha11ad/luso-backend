import { LoginDto } from '../dto';

export interface IAuthController {
  login: (data: LoginDto) => Promise<string>;
}
