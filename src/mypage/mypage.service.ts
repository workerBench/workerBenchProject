import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review';
import { ReviewImage } from 'src/entities/review-image';
import { WishList } from 'src/entities/wish-list';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { ReviewDto } from 'src/mypage/dtos/review.dto';
import { ReviewImageDto } from 'src/mypage/dtos/review-image.dto';
import { Repository } from 'typeorm';
import { WorkShop } from 'src/entities/workshop';
import axios from 'axios';
import { PaymentDto } from 'src/mypage/dtos/payment.dto';
import { Order } from 'src/entities/order';
import { RefundDto } from 'src/mypage/dtos/refund.dto';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(WorkShop)
    private readonly workshopRepository: Repository<WorkShop>,
    @InjectRepository(WishList)
    private readonly wishListRepository: Repository<WishList>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(WorkShopInstanceDetail)
    private readonly workShopInstanceDetailRepository: Repository<WorkShopInstanceDetail>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // 수강 예정 워크샵 전체 조회 API
  async getSoonWorkshops(user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .innerJoinAndSelect('workshop.User', 'teacher')
        .where('customer.id = :id', { id: user_id })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshop.id',
          'workshop.thumb',
          'workshop.title',
          'workshopDetail.status',
          'workshopDetail.wish_date',
          'workshopDetail.member_cnt',
          'workshopDetail.id',
        ])
        .getRawMany();

      // request, non_payment, waiting_lecture만 필터링
      const result = workshops.filter((workshop) => {
        return (
          workshop.workshopDetail_status == 'request' ||
          workshop.workshopDetail_status == 'non_payment' ||
          workshop.workshopDetail_status == 'waiting_lecture'
        );
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  // 수강 예정 워크샵 상세 조회 API
  async getSoonWorkshopsById(id: number, user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .where('customer.id = :user_id', { user_id: user_id })
        .innerJoinAndSelect('workshop.User', 'teacher')
        .innerJoinAndSelect('teacher.TeacherProfile', 'teacherProfile')
        .andWhere('workshopDetail.id = :workshopDetail_id', {
          workshopDetail_id: id,
        })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshopDetail.id',
          'workshopDetail.company',
          'workshopDetail.name',
          'workshopDetail.email',
          'workshopDetail.phone_number',
          'workshopDetail.wish_date',
          'workshopDetail.status',
          'workshopDetail.purpose',
          'workshopDetail.wish_location',
          'workshopDetail.member_cnt',
          'workshopDetail.etc',
          'workshopDetail.category',
          'workshopDetail.user_id',
          'workshopDetail.workshop_id',
          'workshop.id',
          'workshop.title',
          'workshop.category',
          'workshop.thumb',
          'workshop.price',
          'workshop.total_time',
          'workshop.deletedAt',
          'customer.id',
          'customer.email',
          'teacher.id',
          'teacherProfile.phone_number',
          'teacherProfile.name',
        ])
        .getRawMany();

      // request, non_payment, waiting_lecture만 필터링
      const result = workshops.filter((workshop) => {
        return (
          workshop.workshopDetail_status == 'request' ||
          workshop.workshopDetail_status == 'non_payment' ||
          workshop.workshopDetail_status == 'waiting_lecture'
        );
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  // 수강 완료한 워크샵 전체 조회 API
  async getCompleteWorkshops(user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .innerJoinAndSelect('workshop.User', 'teacher')
        .where('customer.id = :id', { id: user_id })
        .andWhere('workshopDetail.status = :status', { status: 'complete' })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshop.id',
          'workshop.thumb',
          'workshop.title',
          'workshopDetail.status',
          'workshopDetail.wish_date',
          'workshopDetail.member_cnt',
          'workshopDetail.id',
        ])
        .getRawMany();

      return workshops;
    } catch (err) {
      throw err;
    }
  }

  // 수강 완료 워크샵 상세 조회 API
  async getCompleteWorkshopsById(id: number, user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .where('customer.id = :user_id', { user_id: user_id })
        .innerJoinAndSelect('workshop.User', 'teacher')
        .innerJoinAndSelect('teacher.TeacherProfile', 'teacherProfile')
        .andWhere('workshopDetail.id = :workshopDetail_id', {
          workshopDetail_id: id,
        })
        .andWhere('workshopDetail.status = :status', { status: 'complete' })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshopDetail.id',
          'workshopDetail.company',
          'workshopDetail.name',
          'workshopDetail.email',
          'workshopDetail.phone_number',
          'workshopDetail.wish_date',
          'workshopDetail.status',
          'workshopDetail.purpose',
          'workshopDetail.wish_location',
          'workshopDetail.member_cnt',
          'workshopDetail.etc',
          'workshopDetail.category',
          'workshopDetail.user_id',
          'workshopDetail.workshop_id',
          'workshop.id',
          'workshop.title',
          'workshop.category',
          'workshop.thumb',
          'workshop.price',
          'workshop.total_time',
          'workshop.deletedAt',
          'customer.id',
          'customer.email',
          'teacher.id',
          'teacherProfile.phone_number',
          'teacherProfile.name',
        ])
        .getRawMany();

      return workshops;
    } catch (err) {
      throw err;
    }
  }

  // 결제하기 버튼 클릭 시 status가 '결제 대기중'인지 체크
  async checkStatusIfNonPayment(user_id: number, workshopInstanceId: number) {
    const workshopDetail = await this.workShopInstanceDetailRepository
      .createQueryBuilder('workshopDetail')
      .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
      .where('workshopDetail.id = :id', { id: workshopInstanceId })
      .getRawMany();

    if (!workshopDetail) {
      throw new NotFoundException('수강 문의 기록이 존재하지 않습니다.');
    }

    if (workshopDetail[0].workshopDetail_status !== 'non_payment') {
      throw new BadRequestException('결제 가능한 상태가 아닙니다.');
    }

    return workshopDetail;
  }

  // 결제하기 클릭 시, 먼저 결제 정보 일치 체크
  async checkPayment(user_id: number, paymentDto: PaymentDto) {
    try {
      const { workshopInstance_id, workshop_id, imp_uid, merchant_uid } =
        paymentDto;

      // 액세스 토큰 발급 받기
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.PORTONE_API_KEY, // REST API 키
          imp_secret: process.env.PORTONE_API_SECRET_KEY, // REST API Secret
        },
      });
      const { access_token } = getToken.data.response; // 인증 토큰
      console.log('accesstoken 발급', access_token);

      // imp_uid로 아임포트 서버에서 결제 정보 조회
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      });
      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      console.log('paymentData 조회', paymentData);

      // 결제금액의 위변조 여부를 검증.
      // 클라이언트에서 입력받은 merchant_uid 와 토큰으로 가져온 merchant_uid 이 다르다면 에러
      if (merchant_uid !== paymentData.merchant_uid) {
        throw new Error('입력받은 상품번호가 잘못되었습니다.');
      }
      // db에서 해당 상품의 금액 조회
      // workshopInstance에서 member_cnt 가져오고
      await this.workShopInstanceDetailRepository.findOne({
        where: { id: Number(workshopInstance_id), user_id },
      });

      // workshop에서 price 가져오고
      const workshop = await this.workshopRepository.findOne({
        where: { id: workshop_id },
      });

      // 아래 코드가 정상적이나, 현재는 100원으로 고정 (테스트 용이므로)
      // const amountToBePaid = workshopInstance.member_cnt * workshop.price;
      const amountToBePaid = 100;

      // 결제 검증하기
      const { amount, status, pay_method } = paymentData;
      console.log('api 로 가져온 결제 내역');
      console.log(paymentData);
      if (amount === amountToBePaid) {
        console.log('문제 없으니 db에 오더 추가');
        console.log(amount, typeof amount);
        // DB에 결제 내역 저장
        const insertOrder = await this.orderRepository.insert({
          user_id,
          imp_uid: paymentData.imp_uid,
          merchant_uid,
          workshop_id,
          amount,
          pay_method,
          status,
        });

        // waiting_lecture 상태로 변경
        await this.workShopInstanceDetailRepository.update(
          { id: Number(workshopInstance_id) },
          {
            status: 'waiting_lecture',
          },
        );

        switch (status) {
          case 'ready':
            console.log('가상 계좌가 발급되었음.');
            return true;
          case 'paid':
            return true;
        }
      } else {
        throw new Error(
          '소비자가 지불한 금액과 클라이언트에게서 입력받은 금액이 일치하지 않습니다.',
        );
      }

      return { message: '결제가 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 환불 정보 입력창 열기 시 status가 '결제 완료'인지 체크
  async checkStatusIfWaitingLecture(
    user_id: number,
    workshopInstanceId: number,
  ) {
    const workshopDetail = await this.workShopInstanceDetailRepository
      .createQueryBuilder('workshopDetail')
      .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
      .innerJoinAndSelect('workshopDetail.OrderInfo', 'order')
      .where('workshopDetail.id = :id', { id: workshopInstanceId })
      .getRawMany();

    console.log('11111111');
    console.log(workshopInstanceId);
    console.log(workshopDetail);

    if (!workshopDetail) {
      throw new NotFoundException('수강 문의 기록이 존재하지 않습니다.');
    }

    if (workshopDetail[0].workshopDetail_status !== 'waiting_lecture') {
      throw new BadRequestException('환불 가능한 상태가 아닙니다.');
    }

    return workshopDetail;
  }

  // 아임포트로 환불 요청 API
  async refundWorkshopPayment(user_id: number, refundInfo: RefundDto) {
    try {
      // imp_uid, merchant_uid, amount로 결제 정보 조회
      const {
        workshopInstance_id,
        merchant_uid,
        cancel_request_amount,
        reason,
      } = refundInfo;
      const paymentData = await this.orderRepository.findOne({
        where: { merchant_uid },
      });

      if (!paymentData) {
        return { message: '결제 정보가 없습니다.' };
      }

      // 조회한 결제 정보로부터 imp_uid 추출
      const { imp_uid } = paymentData;

      // 액세스 토큰 발급 받기
      const getToken = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.PORTONE_API_KEY, // REST API 키
          imp_secret: process.env.PORTONE_API_SECRET_KEY, // REST API Secret
        },
      });
      const { access_token } = getToken.data.response; // 인증 토큰

      console.log('0------', access_token);

      /* 포트원 REST API로 결제환불 요청 */
      const getCancelData = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token, // 포트원 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          reason, // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid, // imp_uid를 환불 `unique key`로 입력
          amount: cancel_request_amount, // 가맹점 클라이언트로부터 받은 환불금액
        },
      });

      console.log('cancelData', getCancelData);
      const { response } = getCancelData.data;
      // const { merchant_uid } = response; // 환불 결과에서 주문정보 추출

      // order 테이블 softdelete
      await this.orderRepository.softDelete({
        merchant_uid: response.merchant_uid,
      });
      // workshopInstance 테이블에서 상태를 refund로 변경
      await this.workShopInstanceDetailRepository.update(
        { id: Number(workshopInstance_id) },
        { status: 'refund' },
      );

      return true;
    } catch (err) {
      console.log(err);
      throw false;
    }
  }

  // 수강 취소 워크샵 전체 조회 API
  async getRefundWorkshops(user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .innerJoinAndSelect('workshop.User', 'teacher')
        .where('customer.id = :id', { id: user_id })
        .andWhere('workshopDetail.status = :status', { status: 'refund' })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshop.id',
          'workshop.thumb',
          'workshop.title',
          'workshopDetail.status',
          'workshopDetail.wish_date',
          'workshopDetail.member_cnt',
          'workshopDetail.id',
        ])
        .getRawMany();

      return workshops;
    } catch (err) {
      throw err;
    }
  }

  // 수강 취소 워크샵 상세 조회 API
  async getRefundWorkshopsById(id: number, user_id: number) {
    try {
      const workshops = await this.workShopInstanceDetailRepository
        .createQueryBuilder('workshopDetail')
        .innerJoinAndSelect('workshopDetail.Workshop', 'workshop')
        .innerJoinAndSelect('workshopDetail.Writer', 'customer')
        .where('customer.id = :user_id', { user_id: user_id })
        .innerJoinAndSelect('workshop.User', 'teacher')
        .innerJoinAndSelect('teacher.TeacherProfile', 'teacherProfile')
        .andWhere('workshopDetail.id = :workshopDetail_id', {
          workshopDetail_id: id,
        })
        .andWhere('workshopDetail.status = :status', { status: 'refund' })
        .andWhere('workshop.deletedAt is null')
        .select([
          'workshopDetail.id',
          'workshopDetail.company',
          'workshopDetail.name',
          'workshopDetail.email',
          'workshopDetail.phone_number',
          'workshopDetail.wish_date',
          'workshopDetail.status',
          'workshopDetail.purpose',
          'workshopDetail.wish_location',
          'workshopDetail.member_cnt',
          'workshopDetail.etc',
          'workshopDetail.category',
          'workshopDetail.user_id',
          'workshopDetail.workshop_id',
          'workshop.id',
          'workshop.title',
          'workshop.category',
          'workshop.thumb',
          'workshop.price',
          'workshop.total_time',
          'workshop.deletedAt',
          'customer.id',
          'customer.email',
          'teacher.id',
          'teacherProfile.phone_number',
          'teacherProfile.name',
        ])
        .getRawMany();

      return workshops;
    } catch (err) {
      throw err;
    }
  }

  // 찜 목록 불러오기
  async getWishList(userId: number) {
    try {
      const userWishList = await this.wishListRepository.find({
        where: { user_id: userId },
        select: ['workshop_id', 'createdAt'],
      });
      if (!userWishList) {
        throw new NotFoundException('등록하신 찜 목록이 없습니다');
      }

      const workshopIdArray = userWishList.map((wishList) => {
        return wishList.workshop_id;
      });

      const myWishWorkshops = await this.workshopRepository
        .createQueryBuilder('workshop')
        .where('workshop.id IN (:...wishWorkshops)', {
          wishWorkshops: workshopIdArray,
        })
        .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
        .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
        .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
        .select([
          'workshop.id',
          'workshop.thumb',
          'workshop.title',
          'workshop.createdAt',
          'workshop.status',
          'workshop.price',
          'genreTag.name',
          'purposeTag.name',
        ])
        .getRawMany();

      return myWishWorkshops;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 워크샵 찜 or 취소하기 API
  /* wishList 엔티티에서 workshop_id와 user_id 찾은 후
      만약 값이 있으면 찜 해제
      없으면 user_id와 workshop_id insert */
  async updateWishListCancel(user_id: number, workshop_id: number) {
    const IsWish = await this.wishListRepository.findOne({
      where: { user_id, workshop_id },
    });
    if (!IsWish) {
      throw new BadRequestException('찜 등록이 된 워크샵이 아닙니다.');
    }
    await this.wishListRepository.delete({ user_id, workshop_id }); // 찜 해제
    return;
  }

  // 리뷰작성 API
  review(workshop_id: number, user_id: number, reviewDto: ReviewDto) {
    const { content, star } = reviewDto;
    this.reviewRepository.insert({
      user_id,
      workshop_id,
      content,
      star,
    });
    return '리뷰 등록이 완료되었습니다.';
  }

  // 리뷰 이미지 첨부 API
  reviewImage(reviewImageDto: ReviewImageDto) {
    const { img_name } = reviewImageDto;
    this.reviewImageRepository.insert({
      img_name,
    });
    return '리뷰 사진 등록이 완료되었습니다.';
  }
}
