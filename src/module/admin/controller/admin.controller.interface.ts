import { Admin } from '@prisma/client';
import { AdminCreateDto, AdminUpdateDto } from '../dto';

export interface IAdminController {
  deleteAdmin: (id: string) => Promise<Admin>;
  createAdmin: (admin: AdminCreateDto) => Promise<Admin>;
  updateAdmin: (id: string, admin: AdminUpdateDto) => Promise<Admin>;
}
