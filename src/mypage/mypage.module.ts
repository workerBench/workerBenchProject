import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { WishList } from 'src/entities/wish-list';
import { WorkshopRepository } from 'src/workshops/workshop.repository';
import { ReviewRepository } from 'src/mypage/review.repository';
import { ReviewImageRepository } from 'src/mypage/review-image.repository';
import { MypageControllerRender } from './mypage.render.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      ReviewImage,
      WishList,
    ]),
  ],
  controllers: [MypageController,MypageControllerRender],
  providers: [MypageService, WorkshopRepository ,ReviewRepository, ReviewImageRepository ],
})
export class MypageModule {}
