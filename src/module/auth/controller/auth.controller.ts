import { LoginDto } from '../dto';
import { AuthService } from '../service/auth.service';
import { IAuthController } from './auth.controller.interface';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto): Promise<string> {
    const { email } = await this.authService.validate(data);
    return this.authService.login({ email });
  }
}
