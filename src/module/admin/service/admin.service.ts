import * as bcrypt from 'bcrypt';
import { Admin } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ExceptionErrorTypes } from '@/types';
import { AdminCreateDto, AdminUpdateDto } from '../dto';
import { IAdminService } from './admin.serivice.interface';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseProvider, EmailProvider, RedisProvider } from '@/common/providers';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisProvider: RedisProvider,
    private readonly emailProvider: EmailProvider,
    private readonly databaseProvider: DatabaseProvider,
  ) {}
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  private findAdminByEmail(email: string): Promise<Admin | null> {
    return this.databaseProvider.admin.findUnique({ where: { email } });
  }

  private findAdminById(id: string): Promise<Admin | null> {
    return this.databaseProvider.admin.findUnique({ where: { id } });
  }

  async sendCreateCode(adminDto: AdminCreateDto): Promise<void> {
    const existingAdmin = await this.findAdminByEmail(adminDto.email);
    if (existingAdmin) {
      throw new BadRequestException(ExceptionErrorTypes.EMAIL_EXISTS);
    }

    const verificationCode: string = Math.floor(1000 + Math.random() * 9000).toString();
    const expirationTime = 6000 * 2;

    try {
      this.emailProvider.sendGmailToSuperAdmin(verificationCode);
      this.redisProvider.setex(verificationCode, adminDto, expirationTime);
    } catch (error) {
      throw new BadGatewayException(`Failed to send verification code: ${error.message}`);
    }
  }
  async verifyCreateCode(code: string): Promise<string> {
    const adminDto = await this.redisProvider.get<AdminCreateDto>(code);
    if (!adminDto) {
      throw new BadRequestException(ExceptionErrorTypes.INVALID_CODE);
    }
    try {
      const hashedPassword = await this.hashPassword(adminDto.password);
      await this.redisProvider.del(code);
      await this.databaseProvider.admin.create({
        data: {
          email: adminDto.email,
          password: hashedPassword,
        },
      });
      return this.jwtService.sign({ email: adminDto.email });
    } catch (error) {
      throw new BadGatewayException(`Failed to create admin: ${error.message}`);
    }
  }

  async updateAdmin(adminId: string, adminUpdateDto: AdminUpdateDto): Promise<Admin> {
    const existingAdmin = await this.findAdminById(adminId);
    if (!existingAdmin) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }

    if (adminUpdateDto.email) {
      const emailExists = await this.findAdminByEmail(adminUpdateDto.email);
      if (emailExists && emailExists.id !== adminId) {
        throw new BadRequestException(ExceptionErrorTypes.EMAIL_EXISTS);
      }
    }
    const updateData = {
      ...(adminUpdateDto.email && { email: adminUpdateDto.email }),
      ...(adminUpdateDto.password && {
        password: await this.hashPassword(adminUpdateDto.password),
      }),
    };

    try {
      return this.databaseProvider.admin.update({
        where: { id: adminId },
        data: updateData,
      });
    } catch (error) {
      throw new BadGatewayException(`Failed to update admin: ${error.message}`);
    }
  }

  async deleteAdmin(adminId: string): Promise<Admin> {
    const existingAdmin = await this.findAdminById(adminId);
    if (!existingAdmin) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }

    try {
      const deletedAdmin = await this.databaseProvider.admin.delete({ where: { id: adminId } });
      await this.redisProvider.del('admin');
      return deletedAdmin;
    } catch (error) {
      throw new BadGatewayException(`Failed to delete admin: ${error.message}`);
    }
  }
}
