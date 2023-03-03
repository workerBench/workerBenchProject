import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'purpose_tag' })
export class PurposeTag extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '목적 이름을 정확히 등록해 주세요' })
  @IsNotEmpty({ message: '목적 이름을 등록해 주세요' })
  @ApiProperty({
    example: '팀 협동성',
    description: '워크샵이 어떠한 목적을 가지는가. 다수의 태그가 붙을 수 있음.',
    required: true,
  })
  @Column('varchar', { name: 'name', length: 20, nullable: false })
  name: string;
}