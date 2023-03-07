import { OmitType, PickType } from '@nestjs/swagger';
import { AdminUser } from 'src/entities/admin-user';
import { User } from 'src/entities/user';

export class CurrentUserDto extends OmitType(User, ['password'] as const) {}

export class CurrentAdminDto extends OmitType(AdminUser, [
  'password',
] as const) {}
