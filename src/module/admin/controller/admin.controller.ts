import { Admin } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { AdminService } from '../service/admin.service';
import { AdminCreateDto, AdminUpdateDto } from '../dto';
import { IAdminController } from './admin.controller.interface';
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { Body, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';

@Controller('admin')
export class AdminController implements IAdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-code')
  @HttpCode(HttpStatus.OK)
  async sendCreateCode(@Body() adminCreateDto: AdminCreateDto): Promise<string> {
    await this.adminService.sendCreateCode(adminCreateDto);
    return "Code has been sent to admin's email";
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCreateCode(@Body('code') code: string): Promise<string> {
    return this.adminService.verifyCreateCode(code);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateAdmin(
    @Param('id') id: string,
    @Body() adminUpdateDto: AdminUpdateDto,
  ): Promise<Admin> {
    return this.adminService.updateAdmin(id, adminUpdateDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAdmin(@Param('id') id: string): Promise<Admin> {
    return this.adminService.deleteAdmin(id);
  }
}
