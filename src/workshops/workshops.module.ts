import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsControllerRender } from './workshops.render.controller';
import { WorkshopsService } from './workshops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkShop, WorkShopInstanceDetail, WishList]),
  ],
  controllers: [WorkshopsController, WorkshopsControllerRender],
  providers: [WorkshopsService],
})
export class WorkshopsModule {}
