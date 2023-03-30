import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Company } from 'src/entities/company';
import { PurposeTag } from 'src/entities/purpose-tag';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkShopPurpose } from 'src/entities/workshop-purpose';
import { Repository } from 'typeorm';
import { TeacherService } from './teacher.service';

const mockteacherRepository = () => ({
  insert: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
});
const mockcompanyRepository = () => ({
  insert: jest.fn(),
});
const mockworkshopRepository = () => ({
  find: jest.fn(),
  map: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
  })),
});
const mockuserRepository = () => ({
  findOne: jest.fn(),
});
const mockInstanchDetailRepository = () => ({
  findOne: jest.fn(),
  update: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TeacherService', () => {
  let service: TeacherService;
  let companyRepository: MockRepository<Company>;
  let teacherRepository: MockRepository<Teacher>;
  let workshopRepository: MockRepository<WorkShop>;
  let userRepository: MockRepository<User>;
  let purposeTagRepository: MockRepository<PurposeTag>;
  let workShopInstanceDetailRepository: MockRepository<WorkShopInstanceDetail>;
  let purposeTagIdRepository: MockRepository<WorkShopPurpose>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockteacherRepository(),
        },
        {
          provide: getRepositoryToken(Company), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockcompanyRepository(),
        },
        {
          provide: getRepositoryToken(WorkShop), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockworkshopRepository(),
        },
        {
          provide: getRepositoryToken(User), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockuserRepository(),
        },
        {
          provide: getRepositoryToken(PurposeTag), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockuserRepository(),
        },
        {
          provide: getRepositoryToken(WorkShopInstanceDetail), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockInstanchDetailRepository(),
        },
        {
          provide: getRepositoryToken(WorkShopPurpose), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockuserRepository(),
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<MockRepository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    companyRepository = module.get<MockRepository<Company>>(
      getRepositoryToken(Company),
    );
    workshopRepository = module.get<MockRepository<WorkShop>>(
      getRepositoryToken(WorkShop),
    );
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    purposeTagRepository = module.get<MockRepository<PurposeTag>>(
      getRepositoryToken(PurposeTag),
    );
    workShopInstanceDetailRepository = module.get<
      MockRepository<WorkShopInstanceDetail>
    >(getRepositoryToken(WorkShopInstanceDetail));
    purposeTagIdRepository = module.get<MockRepository<WorkShopPurpose>>(
      getRepositoryToken(WorkShopPurpose),
    );
  });
  // describe('createTeacherRegister()', () => {
  //   it('강사 전용 워크샵 전체 목록 테스트', async () => {
  //     const user_id = 8;
  //     const workshopData = {
  //       phone_number: '012-0000-0000',
  //       address: '서울',
  //       name: '복덩이',
  //     };
  //     jest.spyOn(teacherRepository, 'insert');
  //     // const result = await service.createTeacherRegister(workshopData);
  //     expect(teacherRepository.findOne).toHaveBeenCalledTimes(1);
  //     // expect(result).toBe('등록이 완료되었습니다.');
  //   });
  // });
  describe('getTeacherWorkshops()', () => {
    it('강사 전용 워크샵 전체 목록 테스트', async () => {
      const workshopData = [
        {
          workshop_title: '제목1',
          workshop_thumb: '이미지1.jpg',
          workshop_status: 'approval',
          workshop_createdAt: '2023-03-13T23:08:52.597Z',
          genreTag_name: '문화예술',
          purposeTag_name: '동기부여',
        },
        {
          workshop_title: '제목2',
          workshop_thumb: '이미지2.jpg',
          workshop_status: 'rejected',
          workshop_createdAt: '2023-03-14T02:23:03.903Z',
          genreTag_name: '심리진단',
          purposeTag_name: '동기부여',
        },
      ];
      jest
        .spyOn(workshopRepository, 'find')
        .mockResolvedValueOnce([workshopData]);
      const result = await service.getTeacherWorkshops();
      expect(workshopRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });
  describe('getTeacherMypage()', () => {
    it('강사 전용 업체 정보 목록 테스트', async () => {
      const mypageData = [
        {
          phone_number: '010-0000-0000',
          address: '주소',
          name: '이름',
          User: {
            email: 'user11@test.com',
          },
          MyCompany: {
            company_type: 0,
            company_name: '업체 이름',
            business_number: 1,
            rrn_front: 999999,
            rrn_back: 1234567,
            bank_name: '농협',
            account: 12333333333,
            saving_name: '이름',
          },
        },
      ];
      jest
        .spyOn(teacherRepository, 'findOne')
        .mockResolvedValueOnce([mypageData]);
      const result = await service.getTeacherMypage();
      expect(teacherRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });
  // describe('createTeacherCompany()', () => {
  //   it('강사 전용 업체 등록 테스트', async () => {
  //     const user_id = 8;
  //     const isBan = 0;
  //     const companyData = {
  //       company_type: 1,
  //       company_name: '이1름1',
  //       business_number: 1,
  //       rrn_front: 123,
  //       rrn_back: 123,
  //       bank_name: '농협',
  //       account: 123,
  //       saving_name: '이름',
  //     };
  //     const results = {
  //       companyData,
  //       isBan,
  //       user_id,
  //     };
  //     jest.spyOn(companyRepository, 'insert');
  //     const result = await service.createTeacherCompany(results);
  //     expect(companyRepository.create).toHaveBeenCalledTimes(1);
  //     expect(result).toBe('등록이 완료되었습니다.');
  //   });
  // });
  // describe('createTeacherWorkshops()', () => {
  //   it('강사 전용 워크샵 전체 목록 테스트', async () => {
  //     const user_id = 8;
  //     const rrn_front = 999999;
  //     const rrn_back = 9999999;
  //     const companyData = {
  //       thumb: '이미지.jpg',
  //       category: 'online',
  //       title: '제목1511',
  //       genre_id: 3,
  //       desc: '설명',
  //       min_member: 1,
  //       max_member: 6,
  //       total_time: 10,
  //       price: 10000,
  //       location: '서울',
  //     };
  //     const results = {
  //       companyData,
  //     };
  //     jest.spyOn(companyRepository, 'insert');
  //     const result = await service.createTeacherWorkshops(results);
  //     expect(companyRepository.create).toHaveBeenCalledTimes(1);
  //     expect(result).toBe('등록이 완료되었습니다.');
  //   });
  // });
  describe('getTeacherIncompleteWorkshop()', () => {
    it('강사 전용 미완료 워크샵 목록 테스트', async () => {
      const mypageData = [
        {
          workshop_title: '제목1',
          workshop_thumb: '이미지1.jpg',
          workshop_min_member: 1,
          workshop_max_member: 6,
          workshop_total_time: 20,
          workshop_price: 100000,
          genreTag_name: '문화예술',
          workShopInstanceDetail_id: 1,
          workShopInstanceDetail_company: '신청회사 1',
          workShopInstanceDetail_email: 'aaaa@test.com',
          workShopInstanceDetail_phone_number: '01099993333',
          workShopInstanceDetail_status: 'request',
          workShopInstanceDetail_member_cnt: 14,
          workShopInstanceDetail_etc: '잘 부탁 드립니다.',
          workShopInstanceDetail_createdAt: '2023-03-13T22:40:37.880Z',
        },
        {
          workshop_title: '제목2',
          workshop_thumb: '이미지2.jpg',
          workshop_min_member: 1,
          workshop_max_member: 1,
          workshop_total_time: 1,
          workshop_price: 1,
          genreTag_name: '문화예술',
          workShopInstanceDetail_id: 2,
          workShopInstanceDetail_company: '신청회사 2',
          workShopInstanceDetail_email: 'aaaa@test.com',
          workShopInstanceDetail_phone_number: '01099993333',
          workShopInstanceDetail_status: 'waiting_lecture',
          workShopInstanceDetail_member_cnt: 14,
          workShopInstanceDetail_etc: '잘 부탁 드립니다.',
          workShopInstanceDetail_createdAt: '2023-03-13T22:40:37.880Z',
        },
      ];
      jest
        .spyOn(workshopRepository, 'find')
        .mockResolvedValueOnce([mypageData]);
      const result = await service.getTeacherIncompleteWorkshop();
      expect(workshopRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });
  describe('getTeacherMypage()', () => {
    it('강사 전용 업체 정보 목록 테스트', async () => {
      const mypageData = [
        {
          phone_number: '010-0000-0000',
          address: '주소',
          name: '이름',
          User: {
            email: 'user11@test.com',
          },
          MyCompany: {
            company_type: 0,
            company_name: '업체 이름',
            business_number: 1,
            rrn_front: 999999,
            rrn_back: 1234567,
            bank_name: '농협',
            account: 12333333333,
            saving_name: '이름',
          },
        },
      ];
      jest
        .spyOn(teacherRepository, 'findOne')
        .mockResolvedValueOnce([mypageData]);
      const result = await service.getTeacherMypage();
      expect(teacherRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });
  describe('getTeacherComplete()', () => {
    it('강사 전용 완료 워크샵 목록 테스트', async () => {
      const mypageData = [
        {
          workshop_title: '제목1',
          workshop_thumb: '이미지1.jpg',
          workshop_min_member: 1,
          workshop_max_member: 6,
          workshop_total_time: 20,
          workshop_price: 100000,
          genreTag_name: '문화예술',
          workShopInstanceDetail_id: 1,
          workShopInstanceDetail_company: '신청회사 1',
          workShopInstanceDetail_email: 'aaaa@test.com',
          workShopInstanceDetail_phone_number: '01099993333',
          workShopInstanceDetail_status: 'complete',
          workShopInstanceDetail_member_cnt: 14,
          workShopInstanceDetail_etc: '잘 부탁 드립니다.',
          workShopInstanceDetail_createdAt: '2023-03-13T22:40:37.880Z',
        },
        {
          workshop_title: '제목2',
          workshop_thumb: '이미지2.jpg',
          workshop_min_member: 1,
          workshop_max_member: 1,
          workshop_total_time: 1,
          workshop_price: 1,
          genreTag_name: '문화예술',
          workShopInstanceDetail_id: 2,
          workShopInstanceDetail_company: '신청회사 2',
          workShopInstanceDetail_email: 'aaaa@test.com',
          workShopInstanceDetail_phone_number: '01099993333',
          workShopInstanceDetail_status: 'complete',
          workShopInstanceDetail_member_cnt: 14,
          workShopInstanceDetail_etc: '잘 부탁 드립니다.',
          workShopInstanceDetail_createdAt: '2023-03-13T22:40:37.880Z',
        },
      ];
      jest
        .spyOn(workshopRepository, 'find')
        .mockResolvedValueOnce([mypageData]);
      const result = await service.getTeacherComplete();
      expect(workshopRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Array);
    });
  });
  describe('updateTeacherAccept()', () => {
    it('강사 전용 수강 문의 수락하기 테스트', async () => {
      const mypageData = { id: 8, status: 'request' };
      workShopInstanceDetailRepository.findOne.mockResolvedValue(mypageData);
      const result = await service.updateTeacherAccept(mypageData.id);
      expect(workShopInstanceDetailRepository.findOne).toHaveBeenCalledTimes(1);
      // expect(result).toBe('워크샵이 수락 되었습니다.');
    });
  });
  describe('updateTeacherComplete()', () => {
    it('강사 전용 수강 문의 종료하기 테스트', async () => {
      const mypageData = { id: 8, status: 'waiting_lecture' };
      workShopInstanceDetailRepository.findOne.mockResolvedValue(mypageData);
      const result = await service.updateTeacherComplete(mypageData.id);
      expect(workShopInstanceDetailRepository.findOne).toHaveBeenCalledTimes(1);
      // expect(result).toBe('워크샵이 수락 되었습니다.');
    });
  });
});
