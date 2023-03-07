import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/user';

export class RegisterAuthDto extends PickType(User, [
  'email',
  'password',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호가 일치하지 않습니다' })
  @ApiProperty({
    example: '12345',
    description: 'password 2차 검증',
    required: true,
  })
  authentNum: string;
}
