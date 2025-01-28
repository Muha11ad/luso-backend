import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { ExceptionErrorTypes } from '@/types';
import { IAuthService } from './auth.service.interface';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseProvider } from '@/common/providers';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly database: DatabaseProvider,
  ) {}
  async validate(data: LoginDto): Promise<Pick<LoginDto, 'email'>> {
    const isEmailExist = await this.database.admin.findUnique({ where: { email: data.email } });
    if (!isEmailExist) throw new NotFoundException(ExceptionErrorTypes.NOT_FOUND);
    const comparePassword = await bcrypt.compare(data.password, isEmailExist.password);
    if (!comparePassword) throw new UnauthorizedException(ExceptionErrorTypes.INVALID_CREDENTIALS);
    return { email: data.email };
  }
  async login({ email }: Pick<LoginDto, 'email'>): Promise<string> {
    try {
      return this.jwtService.sign({ email });
    } catch (error) {
      throw new BadGatewayException(`Error while generating token: ${error.message}`);
    }
  }
}
