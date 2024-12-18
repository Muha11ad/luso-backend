import { hash } from 'bcryptjs';
import { Admin } from '@prisma/client';
import { ExceptionErrorTypes } from '@/types';
import { ConfigService } from '@nestjs/config';
import { AdminCreateDto, AdminUpdateDto } from '../dto';
import { IAdminService } from './admin.serivice.interface';
import { EmailService, DatabaseService, RedisService } from '@/common/services';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.databaseService.admin.findUnique({ where: { email } });
  }

  private async findAdminById(id: string): Promise<Admin | null> {
    return this.databaseService.admin.findUnique({ where: { id } });
  }

  async sendCreateCode(adminDto: AdminCreateDto): Promise<void> {
    const existingAdmin = await this.findAdminByEmail(adminDto.email);
    if (existingAdmin) {
      throw new BadRequestException(ExceptionErrorTypes.EMAIL_EXISTS);
    }

    const verificationCode: string = Math.floor(1000 + Math.random() * 9000).toString();
    const expirationTime = 60 * 2; // 2 minutes

    try {
      await this.emailService.sendGmailToSuperAdmin(verificationCode);
      await this.redisService.setex(verificationCode, adminDto, expirationTime);
    } catch (error) {
      throw new BadGatewayException(`Failed to send verification code: ${error.message}`);
    }
  }
  async verifyCreateCode(code: string): Promise<Admin> {
    const adminDto = await this.redisService.get<AdminCreateDto>(code);
    if (!adminDto) {
      throw new BadRequestException(ExceptionErrorTypes.INVALID_CODE);
    }
    try {
      const salt = this.configService.get<string>('SALT');
      const hashedPassword = await hash(adminDto.password, salt);
      return this.databaseService.admin.create({
        data: {
          email: adminDto.email,
          password: hashedPassword,
        },
      });
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
      ...(adminUpdateDto.password && { password: adminUpdateDto.password }),
    };

    try {
      return this.databaseService.admin.update({
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
      const deletedAdmin = await this.databaseService.admin.delete({ where: { id: adminId } });
      await this.redisService.del('admin');
      return deletedAdmin;
    } catch (error) {
      throw new BadGatewayException(`Failed to delete admin: ${error.message}`);
    }
  }
}
