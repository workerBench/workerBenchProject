import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/user';

export class RegisterJoinDto extends PickType(User, [
  'email',
  'password',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '이메일로 발송된 인증코드를 입력해 주세요' })
  @ApiProperty({
    example: 'efiu439284',
    description: '10글자 이내의 무작위 단어 조합. 이메일 인증을 위해 사용됨.',
    required: true,
  })
  emailAuthCode: string;
}
