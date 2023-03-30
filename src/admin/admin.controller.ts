import {
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { Body, Delete, Query, UseGuards } from '@nestjs/common/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtNormalAdminAuthGuard } from 'src/auth/jwt/access/admin/jwt-normal-admin-guard';
import { JwtSuperAdminAuthGuard } from 'src/auth/jwt/access/admin/jwt-super-admin-guard';
import { AdminService } from './admin.service';
import { editWorkshopDto } from './dto/edit-workshop.dto';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 워크숍 검색 기능 (유저 이메일 / 워크숍 타이틀)
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '검토 중인 워크숍 검색 API' })
  @Get('search/workshops/request')
  @UseGuards(JwtNormalAdminAuthGuard)
  async searchrequestWorkshops(
    @Query('title') title: string,
    @Query('email') email: string,
  ) {
    const workshops = await this.adminService.searchRequestWorkshops({
      title,
      email,
    });
    return workshops;
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '진행 중인 워크숍 검색 API' })
  @Get('search/workshops/approval')
  @UseGuards(JwtNormalAdminAuthGuard)
  async searchApprovalWorkshops(
    @Query('title') title: string,
    @Query('email') email: string,
  ) {
    const workshops = await this.adminService.searchApprovalWorkshops({
      title,
      email,
    });
    return workshops;
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '종료된 워크숍 검색 API' })
  @Get('search/workshops/finished')
  @UseGuards(JwtNormalAdminAuthGuard)
  async searchFinishedWorkshops(
    @Query('title') title: string,
    @Query('email') email: string,
  ) {
    const workshops = await this.adminService.searchFinishedWorkshops({
      title,
      email,
    });
    return workshops;
  }

  // 검토 대기중인 워크숍 목록 불러오기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '검토 중인 워크숍 목록 API' })
  @Get('/workshops/request')
  @UseGuards(JwtNormalAdminAuthGuard)
  async requestWorkshops() {
    return await this.adminService.requestWorkshops();
  }

  // 현재 진행중인 워크숍 목록 불러오기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '진행 중인 워크숍 목록 API' })
  @Get('/workshops/approval')
  @UseGuards(JwtNormalAdminAuthGuard)
  async getApprovedWorkshops() {
    return await this.adminService.getApprovedWorkshops();
  }

  // 종료된 워크숍 목록 불러오기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '종료된 워크숍 목록 API' })
  @Get('workshops/finished')
  @UseGuards(JwtNormalAdminAuthGuard)
  async getFinishedWorkshops() {
    return await this.adminService.getFinishedWorkshops();
  }

  // 워크숍 상세
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크숍 상세 조회 API' })
  @Get('workshops/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async getWorkshopDetail(@Param('id') id: number) {
    return await this.adminService.getWorkshopDetail(id);
  }

  // 워크숍 승인하기 (status:"request" => "approval")
  @ApiResponse({
    status: 200,
    description: 'status:"request" => "approval"',
  })
  @ApiOperation({ summary: '워크숍 승인하기 API' })
  @Patch('/workshop/approval/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async approveWorkshop(@Param('id') id: number) {
    await this.adminService.approveWorkshop(id);
    return { message: '워크숍이 승인 되었습니다.' };
  }

  // 워크숍 반려하기 (status:"request" => "rejected")
  @ApiResponse({
    status: 200,
    description: 'status:"request" => "rejected"',
  })
  @ApiOperation({ summary: '워크숍 반려하기 API' })
  @Patch('/workshop/rejected/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async rejectWorkshop(@Param('id') id: number) {
    await this.adminService.rejectWorkshop(id);
    return { message: '워크숍이 반려 되었습니다.' };
  }

  // 워크숍 수정하기
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '워크숍 수정하기 API' })
  @Put('/workshop/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async updateWorkshop(@Param('id') id: number, @Body() data: editWorkshopDto) {
    const workshop = await this.adminService.updateWorkshop(data, id);
    return { message: '워크숍 수정이 완료되었습니다.' };
  }

  // 워크숍 삭제하기
  @ApiResponse({
    status: 200,
    description: 'status:"approval" => "finished", soft delete',
  })
  @ApiOperation({ summary: '워크숍 삭제하기 API' })
  @Patch('workshop/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async removeWorkshop(@Param('id') id: number) {
    await this.adminService.removeWorkshop(id);

    return { message: '워크숍이 삭제되었습니다.' };
  }

  /*------------------------- 업체 및 유저 관리 기능 -------------------------*/

  // 유저 및 업체 검색 기능
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '유저 및 업체 검색 API' })
  @Get('search/members')
  @UseGuards(JwtNormalAdminAuthGuard)
  async searchUserOrCompany(
    @Query('email') email: string,
    @Query('company') company: string,
  ) {
    const member = await this.adminService.searchUserOrCompany(email, company);
    return member;
  }

  // 밴 처리 된 유저/업체 목록 불러오기

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: 'User 블랙리스트 조회 API' })
  @Get('ban/users')
  @UseGuards(JwtNormalAdminAuthGuard)
  async banList() {
    const list = await this.adminService.userBanList();

    return list;
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: 'Company 블랙리스트 조회 API' })
  @Get('ban/companies')
  @UseGuards(JwtNormalAdminAuthGuard)
  async companyBanList() {
    const list = await this.adminService.companyBanList();

    return list;
  }

  // 업체 및 유저 밴 / 언밴 기능

  @ApiResponse({
    status: 200,
    description: 'User의 isBan : 0 => 1',
  })
  @ApiOperation({ summary: 'User 밴 처리 API' })
  @Patch('ban/user/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async userBan(@Param('id') id: number) {
    await this.adminService.userBan(id);

    return { message: '유저가 밴 처리 되었습니다.' };
  }

  @ApiResponse({
    status: 200,
    description: 'Company의 isBan : 0 => 1',
  })
  @ApiOperation({ summary: 'Company 밴 처리 API' })
  @Patch('ban/company/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async companyBan(@Param('id') id: number) {
    await this.adminService.companyBan(id);

    return { message: '업체가 밴 처리 되었습니다.' };
  }

  @ApiResponse({
    status: 200,
    description: 'User의 isBan : 1 => 0',
  })
  @ApiOperation({ summary: 'User 밴 해제 API' })
  @Patch('unban/user/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async userUnban(@Param('id') id: number) {
    await this.adminService.userUnban(id);

    return { message: '블랙이 해제 되었습니다.' };
  }

  @ApiResponse({
    status: 200,
    description: 'Company의 isBan : 1 => 0',
  })
  @ApiOperation({ summary: 'Company 밴 해제 API' })
  @Patch('unban/company/:id')
  @UseGuards(JwtNormalAdminAuthGuard)
  async companyUnban(@Param('id') id: number) {
    await this.adminService.companyUnban(id);

    return { message: '블랙이 해제 되었습니다.' };
  }

  // 관리자 목록 불러오기

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiOperation({ summary: '관리자 목록 조회 API' })
  @Get('/admin/list')
  @UseGuards(JwtSuperAdminAuthGuard)
  async getAdminList() {
    const result = await this.adminService.getAdminList();

    return result;
  }
}
