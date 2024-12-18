import { Admin } from '@prisma/client';
import { AdminCreateDto, AdminUpdateDto } from '../dto';

export interface IAdminService {
  deleteAdmin(adminId: string): Promise<Admin>;
  verifyCreateCode: (code: string) => Promise<Admin>;
  sendCreateCode: (adminDto: AdminCreateDto) => Promise<void>;
  updateAdmin(adminId: string, adminData: AdminUpdateDto): Promise<Admin>;
}
