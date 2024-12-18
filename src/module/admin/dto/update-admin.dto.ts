import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateDto } from './create-admin.dto';

export class AdminUpdateDto extends PartialType(AdminCreateDto) {}
