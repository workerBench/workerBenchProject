import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPassword {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요' })
  @ApiProperty({
    example: '12345',
    description: 'password 입력',
    required: true,
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호가 일치하지 않습니다' })
  @ApiProperty({
    example: '12345',
    description: 'password 2차 검증',
    required: true,
  })
  authentNum: string;
}
