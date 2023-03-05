import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdminService } from './auth-admin.service';

describe('AuthService', () => {
  let service: AuthAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthAdminService],
    }).compile();

    service = module.get<AuthAdminService>(AuthAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
