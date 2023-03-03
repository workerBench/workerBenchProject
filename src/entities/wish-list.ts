import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'workerbench', name: 'wish_list' })
export class WishList extends CommonEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  user_id: number;

  @IsNotEmpty({ message: '찜하고 싶은 워크샵을 정확히 선택해 주세요' })
  @ApiProperty({
    example: 1,
    description: '워크샵 PK',
    required: true,
  })
  @Column('int', { name: 'workshop_id', nullable: true })
  workshop_id: number;
}
