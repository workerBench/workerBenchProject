import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkShop } from '../entities/workshop';
import { NotFoundException } from '@nestjs/common';

// 사용할 메소드들 jest.fn()으로 가상 사용
const mockAdminRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn()
})

//Mock 타입 주입
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AdminService', () => {
  let adminService: AdminService;
  let workShopRepository: MockRepository<WorkShop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(WorkShop),
          useValue: mockAdminRepository(),
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    workShopRepository = module.get<MockRepository<WorkShop>>(getRepositoryToken(WorkShop));
  });

  // 검토 대기중인 워크숍 목록 TEST
  describe('requestWorkshops', () => {
    it('should return a list of requested workshops', async () => {

      const workShops = [{
        id: 1,
        name: '워크숍 이름',
        status: 'request'
      }, 
      {
        id: 2,
        name: '워크숍2 이름',
        status: 'request'
      }]

      jest.spyOn(workShopRepository, 'find').mockResolvedValueOnce([workShops]);

      const result = await adminService.requestWorkshops();

      expect(workShopRepository.find).toHaveBeenCalledWith({
        where: { status: 'request' },
      });
      expect(result).toEqual([workShops]);
    });
  });

  // 워크숍 승인하기 TEST
  describe('approveWorkshop', () => {
    it('should approve a workshop', async () => {
      const mockWorkshop = {
        id: 1,
        name: '워크숍 이름',
        status: 'request',
      };
      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(mockWorkshop);
      jest.spyOn(workShopRepository, 'update').mockResolvedValueOnce(undefined);

      const result = await adminService.approveWorkshop(mockWorkshop.id);

      expect(workShopRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockWorkshop.id, status: 'request' },
      });
      expect(workShopRepository.update).toHaveBeenCalledWith(mockWorkshop.id, { status: 'approval' });
      expect(result).toEqual(undefined);
    });

    it('should throw a NotFoundException if the workshop does not exist or has already been approved', async () => {
      const mockWorkshop = {
        id: 1,
        name: '워크숍 이름',
        status: 'approval',
      };
      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(adminService.approveWorkshop(mockWorkshop.id)).rejects.toThrowError(
        new NotFoundException('없는 워크숍입니다.'),
      );

      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(mockWorkshop);

      await expect(adminService.approveWorkshop(mockWorkshop.id)).rejects.toThrowError(
        new NotFoundException('없는 워크숍입니다.'),
      );
    });
  });

  // 워크숍 반려하기 TEST
  describe('rejectWorkshop', () => {
    it('should reject a workshop', async () => {
      const mockWorkshop = {
        id: 1,
        name: '워크숍 이름',
        status: 'request',
      };
      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(mockWorkshop);
      jest.spyOn(workShopRepository, 'update').mockResolvedValueOnce(undefined);

      const result = await adminService.rejectWorkshop(mockWorkshop.id);

      expect(workShopRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockWorkshop.id, status: 'request' },
      });
      expect(workShopRepository.update).toHaveBeenCalledWith(mockWorkshop.id, { status: 'rejected' });
      expect(result).toEqual(undefined);
    });

    it('should throw a NotFoundException if the workshop does not exist or has already been rejected', async () => {
      const mockWorkshop = {
        id: 1,
        name: '워크숍 이름',
        status: 'rejected',
      };
      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(adminService.approveWorkshop(mockWorkshop.id)).rejects.toThrowError(
        new NotFoundException('없는 워크숍입니다.'),
      );

      jest.spyOn(workShopRepository, 'findOne').mockResolvedValueOnce(mockWorkshop);

      await expect(adminService.approveWorkshop(mockWorkshop.id)).rejects.toThrowError(
        new NotFoundException('없는 워크숍입니다.'),
      );
    });
  });

});