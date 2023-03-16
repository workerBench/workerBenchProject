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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  // 강사 등록한 전체 워크샵 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 등록한 전체 워크샵 보기 API' })
  @Get('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  async getTeacherWorkshops(@CurrentUser() user: CurrentUserDto) {
    return await this.teacherService.getTeacherWorkshops(user.id);
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
    console.log(user);
    return await this.teacherService.getTeacherMypage(user.id);
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
  // 강사 워크샵 등록
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 워크샵 등록 API' })
  @Post('workshops')
  @UseGuards(JwtTeacherAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 4, { limits: { fileSize: 10 * 1024 * 1024 } }),
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
  // 강사 미완료 목록 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 미완료 목록 보기 API' })
  @Get('workshops/incomplete')
  @UseGuards(JwtTeacherAuthGuard)
  getTeacherIncompleteWorkshop(@CurrentUser() user: CurrentUserDto) {
    return this.teacherService.getTeacherIncompleteWorkshop(user.id);
  }

  // 강사 완료 목록 보기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '강사 완료 목록 보기 API' })
  @Get('workshops/complete')
  @UseGuards(JwtTeacherAuthGuard)
  getTeacherComplete(@CurrentUser() user: CurrentUserDto) {
    return this.teacherService.getTeacherComplete(user.id);
  }

  // 강사 수강 문의 수락하기
  @ApiResponse({
    status: 200,
    description: 'status:"request" => "non_payment"',
  })
  @ApiOperation({ summary: '강사 수강 문의 수락하기 API' })
  @Patch('workshops/manage/accept/:id')
  updateTeacherAccept(@Param('id') id: number) {
    return this.teacherService.updateTeacherAccept(id);
  }

  // 강사 수강 문의 종료하기
  @ApiResponse({
    status: 200,
    description: 'status:"waiting_lecture" => "complete"',
  })
  @ApiOperation({ summary: '강사 수강 문의 종료하기 API' })
  @Patch('workshops/manage/complete/:id')
  updateTeacherComplete(@Param('id') id: number) {
    return this.teacherService.updateTeacherComplete(id);
  }
}
