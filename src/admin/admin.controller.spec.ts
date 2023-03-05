import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [AdminService]
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe('requestWorkshops', () => {
    it('should return an array of workshop requests', async () => {
      const expectedRequests = ['Request 1', 'Request 2'];
      jest.spyOn(service, 'requestWorkshops').mockResolvedValue(expectedRequests);

      const requests = await controller.requestWorkshops();

      expect(requests).toEqual(expectedRequests);
    });
  });
});
