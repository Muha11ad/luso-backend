import { LoginDto } from '../dto';

export interface IAuthService {
  login: (email: Pick<LoginDto, 'email'>) => Promise<string>;
  validate: (data: LoginDto) => Promise<Pick<LoginDto, 'email'>>;
}
