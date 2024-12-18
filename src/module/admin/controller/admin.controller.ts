import { Admin } from '@prisma/client';
import { Controller } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { AdminCreateDto, AdminUpdateDto } from '../dto';
import { Body, Delete, Param, Post, Put } from '@nestjs/common';
import { IAdminController } from './admin.controller.interface';

@Controller('admin')
export class AdminController implements IAdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post()
  async createAdmin(@Body() adminCreateDto: AdminCreateDto): Promise<Admin> {
    return this.adminService.createAdmin(adminCreateDto);
  }

  @Put(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    return this.adminService.updateAdmin(id, adminUpdateDto);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string): Promise<Admin> {
    return this.adminService.deleteAdmin(id);
  }
}
