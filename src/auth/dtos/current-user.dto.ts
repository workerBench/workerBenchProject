import { OmitType, PickType } from '@nestjs/swagger';
import { User } from 'src/entities/user';

export class CurrentUserDto extends OmitType(User, ['password'] as const) {}
