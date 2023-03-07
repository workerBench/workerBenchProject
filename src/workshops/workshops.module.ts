import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order';
import { WishList } from 'src/entities/wish-list';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkshopRepository } from 'src/workshops/order.repository';
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
    ]),
  ],
  controllers: [WorkshopsController, WorkshopsControllerRender],
  providers: [WorkshopsService, WorkshopRepository],
})
export class WorkshopsModule {}
