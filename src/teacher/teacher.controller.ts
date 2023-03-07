import { Body, Controller, Get, Patch, Post, Param,UseGuards } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtUserAuthGuard } from 'src/auth/jwt/access/user/jwt-user-guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { createCompanyDto } from './dto/CreateCompanyDto';
import { createTeacherDto } from './dto/createTeacherDto';
import { createWorkshopsDto } from './dto/createWorkshopsDto';
import { TeacherService } from './teacher.service';
@Controller('/api/teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  // 강사 등록 api
  @Post()
  @UseGuards(JwtUserAuthGuard)
  createTeacherRegister(
    @Body() data: createTeacherDto, @CurrentUser() user: CurrentUserDto) {
    return this.teacherService.createTeacherRegister(
      user.id,
      data.phone_number,
      data.address,
      data.name,
    );
  }
  // 강사 워크샵 목록 api
  @Get('workshops')
  async getTeacherWorkshops() {
     return await this.teacherService.getTeacherWorkshops();
  }
  // 강사 및 업체 정보 api
  @Get('mypage')
  async getTeacherMypage() {
     return await this.teacherService.getTeacherMypage();
  }
  // 강사 업체 등록 api
  @Post('company')
  createTeacherCompany(@Body() data: createCompanyDto) {
    return this.teacherService.createTeacherCompany(
      data.company_type,
      data.company_name,
      data.business_number,
      data.rrn_front,
      data.rrn_back,
      data.bank_name,
      data.account,
      data.saving_name,
      data.isBan,
      data.user_id
    );
  }
  // 강사 워크샵 등록 api
  @Post('workshops')
  createTeacherWorkshops(@Body() data: createWorkshopsDto) {
    return this.teacherService.createTeacherWorkshops(
     data.category, 
     data.genre_id,
     data.title,
     data.desc,
     data.thumb,
     data.min_member,
     data.max_member,
     data.total_time,
     data.price,
     data.location,
    );
  }
  // 강사 미완료 목록 가져오기 api
  @Get('workshops/request')
  getTeacherRequest() {
    return this.teacherService.getTeacherRequest();
  }
  // 강사 완료 목록 가져오기 api
  @Get('workshops/complete')
  getTeacherComplete() {
    return this.teacherService.getTeacherComplete();
  }
  // 강사 수강 문의 관리 (수락하기) api
  // @Patch('workshops/manage/accept/:id')
  // updateTeacherAccept(@Param('id') workshopId: number) {
  //   return this.teacherService.updateTeacherAccept(workshopId);
  // }
  // 강사 수강 문의 관리 (종료하기) pai
  // @Patch('workshops/manage/complete/:id')
  // updateTeacherComplete(@Param('id') workshopId: number) {
  //   return this.teacherService.updateTeacherComplete(workshopId);
  // }
}
