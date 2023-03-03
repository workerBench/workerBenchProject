import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'genre_tag' })
export class GenreTag extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '장르 이름을 정확히 등록해 주세요' })
  @IsNotEmpty({ message: '장르 이름을 입력해 주세요' })
  @ApiProperty({
    example: '문화체육',
    description: '장르, 즉 분야 이름',
    required: true,
  })
  @Column('varchar', {
    name: 'name',
    length: 30,
    nullable: false,
  })
  name: string;
}