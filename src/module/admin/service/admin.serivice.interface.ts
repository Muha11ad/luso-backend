import { Admin } from '@prisma/client';
import { AdminCreateDto, AdminUpdateDto } from '../dto';

export interface IAdminService {
  deleteAdmin(adminId: string): Promise<Admin>;
  createAdmin(adminData: AdminCreateDto): Promise<Admin>;
  updateAdmin(adminId: string, adminData: AdminUpdateDto): Promise<Admin>;
}
