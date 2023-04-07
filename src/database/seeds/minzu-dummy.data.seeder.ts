import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { AdminUser } from '../../entities/admin-user';
import { CompanyApplication } from '../../entities/company-application';
import { Company } from '../../entities/company';
import { GenreTag } from '../../entities/genre-tag';
import { Order } from '../../entities/order';
import { PurposeTag } from '../../entities/purpose-tag';
import { ReviewImage } from '../../entities/review-image';
import { Review } from '../../entities/review';
import { Teacher } from '../../entities/teacher';
import { User } from '../../entities/user';
import { WishList } from '../../entities/wish-list';
import { WorkShopImage } from '../../entities/workshop-image';
import { WorkShopInstanceDetail } from '../../entities/workshop-instance.detail';
import { WorkShop } from '../../entities/workshop';
import { WorkShopPurpose } from '../../entities/workshop-purpose';

import * as bcrypt from 'bcrypt';

export default class MinzuSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // 1. factory를 사용할 경우 (랜덤 데이터)
    // const workShopFactory = await factoryManager.get(WorkShop);
    // await workShopFactory.saveMany(10);
    // 2. dummy data를 하드코딩할 경우
    // 랜덤 날짜 구하는 함수

    // const userPs1 = await bcrypt.hash('12345', 12);
    const userPs2 = await bcrypt.hash('12345', 12);
    const userPs3 = await bcrypt.hash('12345', 12);
    const userPs4 = await bcrypt.hash('12345', 12);
    const userPs5 = await bcrypt.hash('12345', 12);
    const userPs6 = await bcrypt.hash('12345', 12);
    const userPs7 = await bcrypt.hash('12345', 12);
    const userPs8 = await bcrypt.hash('12345', 12);
    const userPs9 = await bcrypt.hash('12345', 12);
    const userPs10 = await bcrypt.hash('12345', 12);
    const userPs11 = await bcrypt.hash('12345', 12);
    const userPs12 = await bcrypt.hash('12345', 12);
    const userPs13 = await bcrypt.hash('12345', 12);

    const adminPs1 = await bcrypt.hash('12345', 12);
    const adminPs2 = await bcrypt.hash('12345', 12);
    const adminPs3 = await bcrypt.hash('12345', 12);

    const adminUserRepository = dataSource.getRepository(AdminUser);
    const companyApplicationRepository =
      dataSource.getRepository(CompanyApplication);
    const companyRepository = dataSource.getRepository(Company);
    const genreTagRepository = dataSource.getRepository(GenreTag);
    const orderRepository = dataSource.getRepository(Order);

    const purposeTagRepository = dataSource.getRepository(PurposeTag);
    const reviewImageRepository = dataSource.getRepository(ReviewImage);
    const reviewRepository = dataSource.getRepository(Review);
    const teacherRepository = dataSource.getRepository(Teacher);
    const userRepository = dataSource.getRepository(User);

    const wishListRepository = dataSource.getRepository(WishList);
    const workshopImageRepository = dataSource.getRepository(WorkShopImage);
    const workshopInstanceDetailRepository = dataSource.getRepository(
      WorkShopInstanceDetail,
    );
    const workshopPurposeRepository = dataSource.getRepository(WorkShopPurpose);
    const workshopRepository = dataSource.getRepository(WorkShop);

    await adminUserRepository.insert([
      {
        email: 'admin1@test.com',
        password: adminPs1,
        name: '테스트1 관리자',
        phone_number: '01022224444',
        admin_type: 0,
      },
      {
        email: 'admin2@test.com',
        password: adminPs2,
        name: '테스트2 관리자',
        phone_number: '01022224444',
        admin_type: 0,
      },
      {
        email: 'admin3@test.com',
        password: adminPs3,
        name: '테스트3 관리자',
        phone_number: '01022224444',
        admin_type: 1,
      },
    ]);

    await userRepository.insert([
      {
        email: 'user1@test.com',
        password: userPs1,
        user_type: 0,
        isBan: 0,
      },
      {
        email: 'user2@test.com',
        password: userPs2,
        user_type: 0,
        isBan: 0,
      },
      {
        email: 'user3@test.com',
        password: userPs3,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user4@test.com',
        password: userPs4,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user5@test.com',
        password: userPs5,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user6@test.com',
        password: userPs6,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user7@test.com',
        password: userPs7,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user8@test.com',
        password: userPs8,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user9@test.com',
        password: userPs9,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user10@test.com',
        password: userPs10,
        user_type: 1,
        isBan: 0,
      },
      {
        email: 'user11@test.com',
        password: userPs11,
        user_type: 0,
        isBan: 0,
      },
      {
        email: 'user12@test.com',
        password: userPs12,
        user_type: 0,
        isBan: 0,
      },
      {
        email: 'user13@test.com',
        password: userPs13,
        user_type: 1,
        isBan: 0,
      },
    ]);

    await genreTagRepository.insert([
      {
        name: '문화예술',
      },
      {
        name: '식음',
      },
      {
        name: '심리진단',
      },
      {
        name: '운동',
      },
    ]);

    await purposeTagRepository.insert([
      {
        name: '동기부여',
      },
      {
        name: '팀워크',
      },
      {
        name: '회식',
      },
      {
        name: '힐링',
      },
    ]);

    await workshopRepository.insert([
      {
        title: '테스트용 워크샵 1',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 1',
        thumb: 'thumb1.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 3,
        genre_id: 1,
        status: 'approval',
        location: '서울시 종로구',
      },
      {
        title: '테스트용 워크샵 2',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 2',
        thumb: 'thumb2.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 3,
        genre_id: 2,
        status: 'approval',
        location: '서울시 종로구',
      },
      {
        title: '테스트용 워크샵 3',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 3',
        thumb: 'thumb2.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 3,
        genre_id: 2,
        status: 'approval',
        location: '서울시 종로구',
      },
      {
        title: '테스트용 워크샵 4',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 4',
        thumb: 'thumb3.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 4,
        genre_id: 1,
        status: 'approval',
        location: '서울시 종로구',
      },
      {
        title: '테스트용 워크샵 5',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 5',
        thumb: 'thumb4.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 4,
        genre_id: 2,
        status: 'approval',
        location: '서울시 종로구',
      },
      {
        title: '테스트용 워크샵 6',
        category: 'online',
        desc: '워크샵에 대한 추가적인 설명 6',
        thumb: 'thumb4.jpeg',
        min_member: 5,
        max_member: 20,
        total_time: 200,
        price: 30000,
        user_id: 4,
        genre_id: 2,
        status: 'request',
        location: '서울시 종로구',
      },
    ]);

    await wishListRepository.insert([
      {
        user_id: 1,
        workshop_id: 1,
      },
      {
        user_id: 1,
        workshop_id: 2,
      },
      {
        user_id: 1,
        workshop_id: 3,
      },
      {
        user_id: 2,
        workshop_id: 3,
      },
      {
        user_id: 2,
        workshop_id: 4,
      },
    ]);

    await teacherRepository.insert([
      {
        user_id: 3,
        phone_number: '01033334444',
        address: '서울시 여러분 안녕',
        name: '3바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 4,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '4바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 5,
        phone_number: '01033335555',
        address: '대구시 여러분 안녕',
        name: '5바보',
        affiliation_company_id: 1,
      },
      {
        user_id: 6,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '6바보',
        affiliation_company_id: 2,
      },
      {
        user_id: 7,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '7바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 8,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '8바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 9,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '9바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 10,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '10바보',
        affiliation_company_id: 0,
      },
      {
        user_id: 13,
        phone_number: '01033335555',
        address: '부산시 여러분 안녕',
        name: '13바보',
        affiliation_company_id: 0,
      },
    ]);

    await companyRepository.insert([
      {
        company_type: 0,
        company_name: '가나다 회사',
        business_number: 12345,
        bank_name: '신한은행',
        account: 12345,
        saving_name: '김바보',
        user_id: 3,
      },
      {
        company_type: 1,
        company_name: '라마바 회사',
        rrn_front: 901023,
        rrn_back: 1111111,
        bank_name: '국민은행',
        account: 12345,
        saving_name: '민바보',
        user_id: 4,
      },
      {
        company_type: 1,
        company_name: '사아자 회사',
        rrn_front: 901023,
        rrn_back: 1111111,
        bank_name: '우리은행',
        account: 12345,
        saving_name: '수바보',
        user_id: 13,
      },
    ]);

    await companyApplicationRepository.insert([
      {
        teacher_id: 7,
        company_id: 1,
      },
      {
        teacher_id: 8,
        company_id: 1,
      },
      {
        teacher_id: 9,
        company_id: 2,
      },
      {
        teacher_id: 10,
        company_id: 2,
      },
    ]);

    await workshopImageRepository.insert([
      {
        img_name: '워크샵1 이미지1',
        workshop_id: 1,
      },
      {
        img_name: '워크샵1 이미지2',
        workshop_id: 1,
      },
      {
        img_name: '워크샵1 이미지3',
        workshop_id: 1,
      },
      {
        img_name: '워크샵2 이미지1',
        workshop_id: 2,
      },
      {
        img_name: '워크샵2 이미지2',
        workshop_id: 2,
      },
      {
        img_name: '워크샵2 이미지3',
        workshop_id: 2,
      },
      {
        img_name: '워크샵3 이미지1',
        workshop_id: 3,
      },
      {
        img_name: '워크샵3 이미지2',
        workshop_id: 3,
      },
      {
        img_name: '워크샵3 이미지3',
        workshop_id: 3,
      },
      {
        img_name: '워크샵4 이미지1',
        workshop_id: 4,
      },
      {
        img_name: '워크샵4 이미지2',
        workshop_id: 4,
      },
      {
        img_name: '워크샵4 이미지3',
        workshop_id: 4,
      },
      {
        img_name: '워크샵5 이미지1',
        workshop_id: 5,
      },
      {
        img_name: '워크샵5 이미지2',
        workshop_id: 5,
      },
      {
        img_name: '워크샵5 이미지3',
        workshop_id: 5,
      },
    ]);

    await reviewRepository.insert([
      {
        content: '재밌었어요 1',
        star: 4,
        user_id: 1,
        workshop_id: 1,
      },
      {
        content: '재밌었어요 2',
        star: 5,
        user_id: 2,
        workshop_id: 1,
      },
      {
        content: '재밌었어요 3',
        star: 4,
        user_id: 11,
        workshop_id: 1,
      },
      {
        content: '재밌었어요 4',
        star: 3,
        user_id: 12,
        workshop_id: 1,
      },
      {
        content: '재밌었어요 1',
        star: 4,
        user_id: 1,
        workshop_id: 2,
      },
      {
        content: '재밌었어요 2',
        star: 5,
        user_id: 2,
        workshop_id: 2,
      },
      {
        content: '재밌었어요 3',
        star: 4,
        user_id: 11,
        workshop_id: 2,
      },
      {
        content: '재밌었어요 4',
        star: 5,
        user_id: 12,
        workshop_id: 2,
      },
    ]);

    await reviewImageRepository.insert([
      {
        img_name: '이미지1.jpeg',
        review_id: 1,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 1,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 2,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 2,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 3,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 3,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 4,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 4,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 5,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 5,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 6,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 6,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 7,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 7,
      },
      {
        img_name: '이미지1.jpeg',
        review_id: 8,
      },
      {
        img_name: '이미지2.jpeg',
        review_id: 8,
      },
    ]);

    await workshopInstanceDetailRepository.insert([
      {
        company: '신청회사 1',
        name: '회사 대표 1',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'request',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 1,
        workshop_id: 1,
      },
      {
        company: '신청회사 1',
        name: '회사 대표 1',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'non_payment',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 1,
        workshop_id: 2,
      },
      {
        company: '신청회사 1',
        name: '회사 대표 1',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'waiting_lecture',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 1,
        workshop_id: 3,
      },
      {
        company: '신청회사 1',
        name: '회사 대표 1',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'complete',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 1,
        workshop_id: 4,
      },
      {
        company: '신청회사 2',
        name: '회사 대표 2',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'request',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 2,
        workshop_id: 1,
      },
      {
        company: '신청회사 2',
        name: '회사 대표 2',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'non_payment',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 2,
        workshop_id: 2,
      },
      {
        company: '신청회사 2',
        name: '회사 대표 2',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'waiting_lecture',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 2,
        workshop_id: 3,
      },
      {
        company: '신청회사 2',
        name: '회사 대표 2',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'complete',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 2,
        workshop_id: 4,
      },
      {
        company: '신청회사 11',
        name: '회사 대표 11',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'request',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 11,
        workshop_id: 1,
      },
      {
        company: '신청회사 11',
        name: '회사 대표 11',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'non_payment',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 11,
        workshop_id: 2,
      },
      {
        company: '신청회사 11',
        name: '회사 대표 11',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'waiting_lecture',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 11,
        workshop_id: 3,
      },
      {
        company: '신청회사 11',
        name: '회사 대표 11',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'complete',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 11,
        workshop_id: 4,
      },
      {
        company: '신청회사 12',
        name: '회사 대표 12',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'request',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 12,
        workshop_id: 1,
      },
      {
        company: '신청회사 12',
        name: '회사 대표 12',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'non_payment',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 12,
        workshop_id: 2,
      },
      {
        company: '신청회사 12',
        name: '회사 대표 12',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'waiting_lecture',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 12,
        workshop_id: 3,
      },
      {
        company: '신청회사 12',
        name: '회사 대표 12',
        email: 'aaaa@test.com',
        phone_number: '01099993333',
        wish_date: '2023/04/05',
        status: 'complete',
        purpose: '팀웍 증진을 위해서',
        wish_location: '서울시 어딘가',
        member_cnt: 14,
        etc: '잘 부탁 드립니다.',
        category: 'offline',
        user_id: 12,
        workshop_id: 4,
      },
    ]);

    // await orderRepository.insert([
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 1,
    //     workshop_id: 3,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 1,
    //     workshop_id: 4,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 2,
    //     workshop_id: 3,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 2,
    //     workshop_id: 4,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 11,
    //     workshop_id: 3,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 11,
    //     workshop_id: 4,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 12,
    //     workshop_id: 3,
    //   },
    //   {
    //     imp_uid: '2487-342nhjk',
    //     amount: 300000,
    //     pay_method: 'card',
    //     status: 'paid',
    //     user_id: 12,
    //     workshop_id: 4,
    //   },
    // ]);

    await workshopPurposeRepository.insert([
      {
        workshop_id: 1,
        purpose_tag_id: 1,
      },
      {
        workshop_id: 1,
        purpose_tag_id: 3,
      },
      {
        workshop_id: 2,
        purpose_tag_id: 1,
      },
      {
        workshop_id: 2,
        purpose_tag_id: 2,
      },
      {
        workshop_id: 3,
        purpose_tag_id: 2,
      },
      {
        workshop_id: 3,
        purpose_tag_id: 3,
      },
      {
        workshop_id: 4,
        purpose_tag_id: 1,
      },
      {
        workshop_id: 4,
        purpose_tag_id: 2,
      },
      {
        workshop_id: 5,
        purpose_tag_id: 1,
      },
      {
        workshop_id: 5,
        purpose_tag_id: 3,
      },
      {
        workshop_id: 6,
        purpose_tag_id: 2,
      },
      {
        workshop_id: 6,
        purpose_tag_id: 3,
      },
    ]);
  }
}
