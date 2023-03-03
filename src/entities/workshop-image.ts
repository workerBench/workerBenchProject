import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'workshop_image' })
export class WorkShopImage extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsString({ message: '첨부한 이미지 이름을 정확히 입력해 주세요' })
  @IsNotEmpty({ message: '첨부한 이미지 이름을 입력해 주세요' })
  @ApiProperty({
    example: '36k6hjk452jhk6.jpeg',
    description: '워크샵 상품 등록 시 첨부하는 이미지',
    required: true,
  })
  @Column('varchar', { name: 'img_name', length: 50, nullable: false })
  img_name: string;

  @ApiProperty({
    example: 1,
    description: '워크샵 PK',
    required: true,
  })
  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number | null;
}
