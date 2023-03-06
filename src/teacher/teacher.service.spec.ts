import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherService],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // 강사 등록 api 테스트
  // 업체 등록 api 테스트
  describe('createTeacherCompany', () => {
    it('업체 등록 api 테스트'), () =>{
      // service.create({
        
      //   company_type: 1,
      //   company_name: "테스트",


      // })
    }
      
  });
})
