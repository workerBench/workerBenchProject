import { IsString, IsNumber } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  readonly phone_number: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly name: string;
}
