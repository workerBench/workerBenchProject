import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order';
import { Review } from 'src/entities/review';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsControllerRender } from './workshops.render.controller';
import { WorkshopsService } from './workshops.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkShop,
      WorkShopInstanceDetail,
      WishList,
      Order,
      Review,
    ]),
  ],
  controllers: [WorkshopsController, WorkshopsControllerRender],
  providers: [WorkshopsService],
})
export class WorkshopsModule {}
