import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
  Res,
  Query,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { JwtUserAuthGuard } from 'src/auth/jwt/access/user/jwt-user-guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PurposeTag } from 'src/entities/purpose-tag';
import { CreateCompanyDto } from './dto/teacher-company.dto';
import { CreateTeacherDto } from './dto/teacher.dto';
import { CreateWorkshopsDto } from './dto/teacher-workshops.dto';
import { TeacherService } from './teacher.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtTeacherAuthGuard } from 'src/auth/jwt/access/user/jwt-teacher-guard';
import { AuthService } from 'src/auth/auth.service';
import { RealIP } from 'nestjs-real-ip';
import { Request, Response } from 'express';
import { TOKEN_NAME } from 'src/auth/naming/token-name';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateWorkshopsDto2 } from './dto/teacher-test.dto';
@ApiTags('teacher')
@Controller('/api/teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly authService: AuthService,
  ) {}

  // 강사 등록
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 등록 API' })
  @Post()
  @UseGuards(JwtUserAuthGuard)
  async createTeacherRegister(
    @Body() data: CreateTeacherDto,
    @CurrentUser() user: CurrentUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    const result = await this.teacherService.createTeacherRegister(
      data,
      user.id,
    );
    const userInfo = await this.authService.getUserById(user.id);

    response.clearCookie(TOKEN_NAME.userAccess);
    response.clearCookie(TOKEN_NAME.userRefresh);

    const accessToken = await this.authService.makeAccessToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
    );
    const refreshToken = await this.authService.makeRefreshToken(
      userInfo.id,
      userInfo.email,
      userInfo.user_type,
      clientIp,
    );

    response.cookie(TOKEN_NAME.userAccess, accessToken, { httpOnly: true });
    response.cookie(TOKEN_NAME.userRefresh, refreshToken, { httpOnly: true });

    return result;
  }

  // 강사 등록한 전체 워크샵 목록
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 등록한 전체 워크샵 보기 API' })
  @Get('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherWorkshops(@CurrentUser() user: CurrentUserDto) {
    const data = await this.teacherService.getTeacherWorkshops(user.id);
    const result = { workshop: data };
    return result;
  }

  // 강사 및 업체 정보 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 및 업체 정보 보기 API' })
  @Get('mypage')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherMypage(@CurrentUser() user: CurrentUserDto) {
    const data = await this.teacherService.getTeacherMypage(user.id);
    const result = { teacher: data };
    return result;
  }

  // 강사 업체 등록
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 업체 등록 API' })
  @Post('company')
  @UseGuards(JwtTeacherAuthGuard)
  createTeacherCompany(
    @Body() data: CreateCompanyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.teacherService.createTeacherCompany(data, user.id);
  }

  // 업체 목록 조회
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: 'company_type : 0인 업체 목록 조회 API' })
  @Get('companies')
  @UseGuards(JwtTeacherAuthGuard)
  async gerAllCompanies() {
    return await this.teacherService.gerAllCompanies();
  }

  // 강사 업체 검색
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 등록된 업체 검색 API' })
  @Get('company/search')
  @UseGuards(JwtTeacherAuthGuard)
  async searchCompanys(@Query('company_name') company_name: string) {
    return await this.teacherService.searchCompanys(company_name);
  }

  // 강사 등록된 업체에 등록 신청
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 등록된 업체에 등록 신청 API' })
  @Post('company/apply/:id')
  @UseGuards(JwtTeacherAuthGuard)
  registerTeacherCompany(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.registerTeacherCompany(user.id, id);
  }

  // 업체소속을 신청한 업체 목록 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '신청한 업체 목록 보기 API' })
  @Get('company/apply')
  @UseGuards(JwtTeacherAuthGuard)
  getApplyCompanys(@CurrentUser() user: CurrentUserDto) {
    return this.teacherService.getApplyCompanys(user.id);
  }

  // 업체 소속을 신청한 업체 수락하기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '신청한 업체 수락하기 API' })
  @Patch('company/accept/:id')
  @UseGuards(JwtTeacherAuthGuard)
  registerCompany(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.registerCompany(user.id, id);
  }

  // 업체 소속을 신청한 강사 반려하기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '신청한 업체 반려하기 API' })
  @Delete('company/cancle/:id')
  @UseGuards(JwtTeacherAuthGuard)
  cancleApplyCompany(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.cancleApplyCompany(user.id, id);
  }

  // 강사 워크샵 등록 신청
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 워크샵 등록 신청 API' })
  @Post('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  async createTeacherWorkshops(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() data: any, // CreateWorkshopsDto
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.teacherService.createTeacherWorkshops(
      JSON.parse(data.jsonData),
      images,
      user.id,
    );
  }

  // 강사 워크샵 등록 - 비디오
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 워크샵 등록 API' })
  @Post('workshops/video')
  @UseGuards(JwtTeacherAuthGuard)
  @UseInterceptors(
    FileInterceptor('video', { limits: { fileSize: 350 * 1024 * 1024 } }),
  )
  async uploadVideoAfterCreateWorkshop(
    @UploadedFile() video: Express.Multer.File,
    @Body() data: any,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.teacherService.uploadVideo(
      JSON.parse(data.jsonData),
      video,
      user.id,
    );
  }
  // 강사 워크샵 상세보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 워크샵 상세보기 API' })
  @Get('workshop/detail/:id')
  @UseGuards(JwtTeacherAuthGuard)
  async workshopDetail(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    const data = await this.teacherService.workshopDetail(user.id, id);
    const result = { detailWorkshop: data };
    return result;
  }
  // 강사 미완료 목록 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 미완료 목록 보기 API' })
  @Get('workshops/incomplete')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherIncompleteWorkshop(@CurrentUser() user: CurrentUserDto) {
    const data = await this.teacherService.getTeacherIncompleteWorkshop(
      user.id,
    );
    const result = { non_complete_instance_list: data };
    return result;
  }

  // 강사 완료 목록 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 완료 목록 보기 API' })
  @Get('workshops/complete')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherComplete(@CurrentUser() user: CurrentUserDto) {
    const data = await this.teacherService.getTeacherComplete(user.id);
    const result = { complete_instance_list: data };
    return result;
  }

  // 강사 수강 문의 수락하기
  @ApiResponse({
    status: 200,
    description: 'status:"request" => "non_payment"',
  })
  @ApiOperation({ summary: '강사 수강 문의 수락하기 API' })
  @Patch('workshops/manage/accept/:id')
  @UseGuards(JwtTeacherAuthGuard)
  updateTeacherAccept(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.updateTeacherAccept(user.id, id);
  }

  // 강사 수강 문의 종료하기
  @ApiResponse({
    status: 200,
    description: 'status:"waiting_lecture" => "complete"',
  })
  @ApiOperation({ summary: '강사 수강 문의 종료하기 API' })
  @Patch('workshops/manage/complete/:id')
  @UseGuards(JwtTeacherAuthGuard)
  updateTeacherComplete(
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.updateTeacherComplete(user.id, id);
  }

  // 강사 수강 문의 반려하기
  @ApiResponse({
    status: 200,
    description: 'status:"request" || "status: => "non_payment" => "rejected"',
  })
  @ApiOperation({ summary: '강사 신청한 워크샵 반려하기 API' })
  @Patch('workshops/manage/reject/:id')
  @UseGuards(JwtTeacherAuthGuard)
  cancleWorkshop(@CurrentUser() user: CurrentUserDto, @Param('id') id: number) {
    return this.teacherService.cancleWorkshop(user.id, id);
  }

  // 강사 워크샵 수정하기
  @ApiResponse({
    status: 200,
    description: 'status:"request" || "status: => "non_payment" => "rejected"',
  })
  @ApiOperation({ summary: '강사 워크샵 수정하기 API' })
  @Patch('workshop/update/:id')
  @UseGuards(JwtTeacherAuthGuard)
  updateWorkshop(
    @Body() data: CreateWorkshopsDto2,
    @CurrentUser() user: CurrentUserDto,
    @Param('id') id: number,
  ) {
    return this.teacherService.updateWorkshop(data, user.id, id);
  }
}
