import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthCodeForRePs {
  @IsEmail()
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해 주세요' })
  @ApiProperty({
    example: 'lololo@efj.com',
    description: '유저 이메일',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '이메일로 발송된 인증코드를 입력해 주세요' })
  @ApiProperty({
    example: 'efiu439284',
    description: '10글자 이내의 무작위 단어 조합. 이메일 인증을 위해 사용됨.',
    required: true,
  })
  emailAuthCode: string;
}
