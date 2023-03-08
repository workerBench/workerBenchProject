import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsService } from './workshops.service';
import { Repository } from 'typeorm';
import { WorkShop } from 'src/entities/workshop';
import { getRepositoryToken } from '@nestjs/typeorm';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import { Order } from 'src/entities/order';

// repository mock 함수로 만들기 (repository에 사용되는 메소드를 mock)
const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    OrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
  }),
});

// MockRepository 타입 선언
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('WorkshopsService', () => {
  let service: WorkshopsService;
  let workshopRepository: MockRepository<WorkShop>;
  let orderRepository: MockRepository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        Connection,
        {
          provide: getRepositoryToken(WorkShop), // key: WorkShop entitiy를 가지는 레포지토리 토큰 발급
          useValue: mockRepository(), // provide 키에 매칭되는 value (=provide 대신 쓰는 value)
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
    workshopRepository = module.get<MockRepository<WorkShop>>(
      getRepositoryToken(WorkShop),
    );
    orderRepository = module.get<MockRepository<Order>>(
      getRepositoryToken(Order),
    );
  });

  // 인기 워크샵 조회 API 테스트
  describe('getBestWorkshops()', () => {
    it.todo('인기 워크샵 잘 불러오는지 검증');

    it('인기 워크샵 목록 잘 불러오는지 검증', async () => {
      workshopRepository.find.mockResolvedValue([]); // mockResolvedValue: 반환값을 정함

      const result = await service.getBestWorkshops();

      expect(workshopRepository.find).toHaveBeenCalledTimes(1); // 1번만 호출
      expect(result).toBeInstanceOf(Array); // 값이 배열로 반환되는지
    });
  });
});
