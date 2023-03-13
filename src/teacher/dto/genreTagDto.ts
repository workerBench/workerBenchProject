import { IsNumber } from 'class-validator';

export class genreTagDto {
  @IsNumber()
  readonly name: number;
}