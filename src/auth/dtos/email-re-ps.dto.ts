import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/user';

export class EmailForReset extends PickType(User, ['email'] as const) {}
