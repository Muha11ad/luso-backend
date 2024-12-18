import { Admin } from '@prisma/client';
import { ExceptionErrorTypes } from '@/types';
import { AdminCreateDto, AdminUpdateDto } from '../dto';
import { IAdminService } from './admin.serivice.interface';
import { EmailService, DatabaseService, RedisService } from '@/common/services';
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async checkEmailExists(email: string): Promise<Admin | null> {
    return await this.databaseService.admin.findUnique({ where: { email } });
  }

  private async checkAdminExists(id: string): Promise<Admin | null> {
    return await this.databaseService.admin.findUnique({ where: { id } });
  }

  async createAdmin(admin: AdminCreateDto): Promise<Admin> {
    const emailExists = await this.checkEmailExists(admin.email);
    if (emailExists) {
      throw new BadRequestException(ExceptionErrorTypes.EMAIL_EXISTS);
    }
    try {
      await this.emailService.sendGmailToSuperAdmin('Welcome to the admin panel');
      const result = await this.databaseService.admin.create({ data: admin });
      await this.redisService.set('admin', result);
      return result;
    } catch (error) {
      throw new BadGatewayException(`Failed to create admin: ${error.message}`);
    }
  }

  async updateAdmin(adminId: string, adminData: AdminUpdateDto): Promise<Admin> {
    const admin = await this.checkAdminExists(adminId);
    if (admin === null) {
      throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
    }

    if (adminData.email) {
      const emailExists = await this.checkEmailExists(adminData.email);
      if (emailExists && emailExists.id !== adminId) {
        throw new BadRequestException(ExceptionErrorTypes.EMAIL_EXISTS);
      }
    }

    const updateAdminData = {
      ...(adminData.email && { email: adminData.email }),
      ...(adminData.password && { password: adminData.password }),
    };

    try {
      return await this.databaseService.admin.update({
        where: { id: adminId },
        data: updateAdminData,
      });
    } catch (error) {
      throw new BadGatewayException(`Failed to update admin: ${error.message}`);
    }
  }

  async deleteAdmin(adminId: string): Promise<Admin> {
    try {
      const admin = await this.checkAdminExists(adminId);
      if (admin === null) {
        throw new BadRequestException(ExceptionErrorTypes.NOT_FOUND);
      }

      const result = await this.databaseService.admin.delete({ where: { id: adminId } });
      await this.redisService.del('admin');
      return result;
    } catch (error) {
      throw new BadGatewayException(`Failed to delete admin: ${error.message}`);
    }
  }
}
