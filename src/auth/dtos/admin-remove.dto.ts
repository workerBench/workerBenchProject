import { PickType } from '@nestjs/swagger';
import { AdminUser } from 'src/entities/admin-user';

export class AdminRemoveDto extends PickType(AdminUser, ['email'] as const) {}
