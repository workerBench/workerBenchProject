import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkShop } from '../entities/workshop';

describe('AdminService', () => {
  let adminService: AdminService;
  let workshopRepository: Repository<WorkShop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(WorkShop),
          useClass: Repository,
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    workshopRepository = module.get<Repository<WorkShop>>(getRepositoryToken(WorkShop));
  });

  describe('requestWorkshops', () => {
    it('should return a list of requested workshops', async () => {
      const workshop1 = new WorkShop();
      workshop1.id = 1;
      workshop1.status = 'request';

      const workshop2 = new WorkShop();
      workshop1.id = 2;
      workshop1.status = 'approval';

      jest.spyOn(workshopRepository, 'find').mockResolvedValueOnce([workshop1]);

      const result = await adminService.requestWorkshops();

      expect(workshopRepository.find).toHaveBeenCalledWith({
        where: { status: 'request' },
      });
      expect(result).toEqual([workshop1]);
    });
  });
});




