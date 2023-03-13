import { IsString,IsNumber } from 'class-validator';

export class creatpurposeDto {
  
  @IsNumber()
  readonly workshop_id: number;

  @IsNumber()
  readonly purpose_tag_id: number;
}