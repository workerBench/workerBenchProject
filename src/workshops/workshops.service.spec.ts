import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsService } from './workshops.service';
import { Repository } from 'typeorm';
import { WorkShop } from 'src/entities/workshop';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WishList } from 'src/entities/wish-list';

// repository mock 함수로 만들기 (repository에 사용되는 메소드를 mock)
const mockWorkshopRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockWishRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
});

// MockRepository 타입 선언
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('WorkshopsService', () => {
  let service: WorkshopsService;
  let workshopRepository: MockRepository<WorkShop>;
  let wishRepository: MockRepository<WishList>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        {
          provide: getRepositoryToken(WorkShop), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockWorkshopRepository(), // provide 키에 매칭되는 value (=provide 대신 쓰는 value)
        },
        {
          provide: getRepositoryToken(WishList),
          useValue: mockWishRepository(),
        },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
    workshopRepository = module.get<MockRepository<WorkShop>>(
      getRepositoryToken(WorkShop),
    );
    wishRepository = module.get<MockRepository<WishList>>(
      getRepositoryToken(WishList),
    );
  });

  // 신규 워크샵 조회 API 테스트
  describe('getNewWorkshops()', () => {
    it.todo('신규 워크샵 목록 잘 불러오는지 검증');

    it('신규 워크샵 목록 잘 불러오는지 검증', async () => {
      workshopRepository.find.mockResolvedValue([]); // mockResolvedValue: 반환값을 정함

      const result = await service.getNewWorkshops();

      expect(workshopRepository.find).toHaveBeenCalledTimes(1); // 1번만 호출
      expect(result).toBeInstanceOf(Array); // 값이 배열로 반환
    });
  });

  // 워크샵 상세 조회 API 테스트
  describe('getWorkshopDetail()', () => {
    it.todo('워크샵 상세 잘 불러오는지 검증');

    it('워크샵 상세 잘 불러오는지 검증', async () => {
      const workshopData = {
        id: 1,
        title: '워크샵 제목',
        category: 'offline',
        desc: '워크샵 상세 설명',
        thumb: '이미지 링크',
        min_member: 10,
        max_member: 50,
        total_time: 120,
        price: 30000,
        status: 'approve',
        location: '지역',
        user_id: 1,
        genre_id: 1,
      };

      workshopRepository.findOne.mockResolvedValue(workshopData);

      const result = await service.getWorkshopDetail(1);

      expect(workshopRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(workshopData); // 데이터가 일치하는지
    });
  });

  // 찜하기 API 테스트
  describe('addToWish()', () => {
    it.todo('회원이 해당 워크샵을 찜하지 않았으면 찜 하기 검증');
    it.todo('회원이 해당 워크샵을 이미 찜했으면 찜 취소하기 검증');

    const dbData = { user_id: 3, workshop_id: 3 };

    it('회원이 해당 워크샵을 찜하지 않았으면 찜 하기 검증', async () => {
      // 가짜 데이터 전달
      const myData = {
        user_id: 3,
        workshop_id: 2,
      };
      wishRepository.findOne.mockImplementation(() => null); // null 값이 반환됐을 때
      jest.spyOn(wishRepository, 'insert'); // insert 함수가 호출되었는지

      const result = await service.addToWish(
        myData.user_id,
        myData.workshop_id,
      );

      expect(wishRepository.findOne).toHaveBeenCalledTimes(1);
      expect(wishRepository.insert).toHaveBeenCalledTimes(1);
      expect(result).toBe('찜하기 성공!');
    });

    it('회원이 해당 워크샵을 이미 찜했으면 찜 취소하기 검증', async () => {
      // 가짜 데이터 전달

      const myData = {
        user_id: 3,
        workshop_id: 3,
      };
      wishRepository.findOne.mockResolvedValue(dbData);
      wishRepository.delete.mockResolvedValue(myData);

      const result = await service.addToWish(
        myData.user_id,
        myData.workshop_id,
      );

      expect(wishRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBe('찜하기 취소!');
    });
  });
});
