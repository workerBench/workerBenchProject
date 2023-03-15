import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { WishList } from 'src/entities/wish-list';
import { ReviewRepository } from 'src/mypage/review.repository';
import { ReviewImageRepository } from 'src/mypage/review-image.repository';
import { MypageControllerRender } from './mypage.render.controller';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      ReviewImage,
      WishList,
      WorkShopInstanceDetail,
    ]),
    AuthModule,
  ],
  controllers: [MypageController, MypageControllerRender],
  providers: [MypageService, ReviewRepository, ReviewImageRepository],
})
export class MypageModule {}
