import { PickType } from '@nestjs/swagger';
import { AdminUser } from 'src/entities/admin-user';

export class AdminLoginDto extends PickType(AdminUser, [
  'email',
  'password',
] as const) {}
