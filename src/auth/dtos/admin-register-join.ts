import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AdminUser } from 'src/entities/admin-user';

export class AdminRegisterJoinDto extends PickType(AdminUser, [
  'email',
  'password',
  'name',
  'phone_number',
] as const) {
  //   @IsString()
  //   @IsNotEmpty({ message: '비밀번호가 일치하지 않습니다' })
  //   @ApiProperty({
  //     example: '12345',
  //     description: 'password 2차 검증',
  //     required: true,
  //   })
  //   authentNum: string;
}
