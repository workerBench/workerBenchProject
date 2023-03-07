import { IsString,IsNumber } from 'class-validator';

export class createTeacherDto {
  
  @IsString()
  readonly phone_number: string;

  @IsString()
  readonly address: string;

  @IsString()
  readonly name: string;
}