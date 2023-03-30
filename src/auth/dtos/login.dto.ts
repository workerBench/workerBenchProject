import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/user';

export class LoginDto extends PickType(User, ['email', 'password'] as const) {}
