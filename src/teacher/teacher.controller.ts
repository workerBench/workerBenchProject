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
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtTeacherAuthGuard } from 'src/auth/jwt/access/user/jwt-teacher-guard';
import { AuthService } from 'src/auth/auth.service';
import { RealIP } from 'nestjs-real-ip';
import { Request, Response } from 'express';
import { TOKEN_NAME } from 'src/auth/naming/token-name';

// @UseInterceptors(SuccessInterceptor)
@Controller('/api/teacher')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly authService: AuthService,
  ) {}

  // 강사 등록 api
  @Post()
  @UseGuards(JwtUserAuthGuard)
  async createTeacherRegister(
    @Body() data: CreateTeacherDto,
    @CurrentUser() user: CurrentUserDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @RealIP() clientIp: string,
  ) {
    await this.teacherService.createTeacherRegister(data, user.id);
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

    return;
  }

  // 강사 전체 워크샵 목록 api
  @Get('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherWorkshops(@CurrentUser() user: CurrentUserDto) {
    return await this.teacherService.getTeacherWorkshops(user.id);
  }
  // 강사 및 업체 정보 api
  @Get('mypage')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherMypage(@CurrentUser() user: CurrentUserDto) {
    console.log(user);
    return await this.teacherService.getTeacherMypage(user.id);
  }
  // 강사 업체 등록 api
  @Post('company')
  @UseGuards(JwtTeacherAuthGuard)
  createTeacherCompany(
    @Body() data: CreateCompanyDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.teacherService.createTeacherCompany(data, user.id);
  }
  // 강사 워크샵 등록 api
  @Post('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  createTeacherWorkshops(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() data: any, // CreateWorkshopsDto
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.teacherService.createTeacherWorkshops(
      JSON.parse(data.jsonData),
      images,
      user.id,
    );
  }
  // 강사 미완료 목록 가져오기 api
  @Get('workshops/incomplete')
  @UseGuards(JwtTeacherAuthGuard)
  getTeacherIncompleteWorkshop(@CurrentUser() user: CurrentUserDto) {
    return this.teacherService.getTeacherIncompleteWorkshop(user.id);
  }

  // 강사 완료 목록 가져오기 api
  @Get('workshops/complete')
  @UseGuards(JwtTeacherAuthGuard)
  getTeacherComplete(@CurrentUser() user: CurrentUserDto) {
    return this.teacherService.getTeacherComplete(user.id);
  }

  // 강사 수강 문의 관리 (수락하기) api
  @Patch('workshops/manage/accept/:id')
  updateTeacherAccept(@Param('id') id: number) {
    return this.teacherService.updateTeacherAccept(id);
  }

  // 강사 수강 문의 관리 (종료하기) api
  @Patch('workshops/manage/complete/:id')
  updateTeacherComplete(@Param('id') id: number) {
    return this.teacherService.updateTeacherComplete(id);
  }
}
