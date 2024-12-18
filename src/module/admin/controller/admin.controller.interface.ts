import { Admin } from '@prisma/client';
import { AdminCreateDto, AdminUpdateDto } from '../dto';

export interface IAdminController {
  deleteAdmin: (id: string) => Promise<Admin>;
  verifyCreateCode: (code: string) => Promise<Admin>;
  sendCreateCode: (admin: AdminCreateDto) => Promise<string>;
  updateAdmin: (id: string, admin: AdminUpdateDto) => Promise<Admin>;
}
