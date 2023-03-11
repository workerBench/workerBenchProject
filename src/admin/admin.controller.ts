import { Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { Body, Delete, Query, UseGuards } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { JwtSuperAdminAuthGuard } from 'src/auth/jwt/access/admin/jwt-super-admin-guard';
import { AdminService } from './admin.service';
import { editWorkshopDto } from './dto/edit-workshop.dto';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // 검토 대기중인 워크숍 목록을 불러오는 API입니다.
    @Get('/workshops/request')

    async requestWorkshops() {
        const requestWorkshops = await this.adminService.requestWorkshops()
        return requestWorkshops
    }

    // 워크숍 승인하기 (status:"request" => "approval")
    @Patch('/workshop/approval/:id')
    async approveWorkshop(@Param("id") id: number) {
        await this.adminService.approveWorkshop(id)
        return { message: "워크숍이 승인 되었습니다."}
    }

    // 워크숍 반려하기 (status:"request" => "rejected")
    @Patch('/workshop/rejected/:id')
    async rejectWorkshop(@Param("id") id: number) {
        await this.adminService.rejectWorkshop(id)
        return { message: "워크숍이 반려 되었습니다."}
    }

    // status:"approval"인 모든 워크숍 목록 가져오기
    @Get('/workshops')
    async getApprovedWorkshops() {
        const workshops = await this.adminService.getApprovedWorkshops()
        return workshops
    }

    // 워크숍 수정하기
    @Put('/workshop/:id')
    async updateWorkshop(
        @Param("id") id: number,
        @Body() data: editWorkshopDto
    ) {
        const workshop = await this.adminService.updateWorkshop(
            data,
            id,
        )
        return { message: "워크숍 수정이 완료되었습니다." }
    }

    // 워크숍 삭제하기
    @Delete('workshop/:id')
    async removeWorkshop(@Param("id") id: number) {
        await this.adminService.removeWorkshop(id)

        return { message: "워크숍이 삭제되었습니다." }
    }

    /*------------------------- 업체 및 유저 Ban/Unban 기능 -------------------------*/

    @Patch('ban/user/:id')
    async userBan(@Param("id") id: number) {
        await this.adminService.userBan(id)

        return { message: "유저가 밴 처리 되었습니다." }
    }

    @Patch('unban/user/:id')
    async userUnban(@Param("id") id: number) {
        await this.adminService.userUnban(id)

        return { message: "블랙이 해제 되었습니다." }
    }

    @Patch('ban/company:id')
    async companyBan(@Param("id") id: number) {
        await this.adminService.companyBan(id)

        return { message: "업체가 밴 처리 되었습니다." }
    }

    @Patch('ban/company:id')
    async companyUnban(@Param("id") id: number) {
        await this.adminService.companyUnban(id)

        return { message: "블랙이 해제 되었습니다." }
    }

    // 밴 처리 된 유저/업체 목록 불러오기
    @Get('ban/members')
    async banList() {
        const list = await this.adminService.banList()

        return list
    }

    // 관리자 목록 불러오기

    @Get('/admin/list')
    async getAdminList() {
        const result = await this.adminService.getAdminList()

        return result
    }

    /*------------------------- 검색 기능 모음 -------------------------*/

    // 워크숍 검색 기능 (유저 이메일 / 워크숍 타이틀)
    @Get('search/workshops')
    async searchWorkshops(
        // @Query('search') titleOrEmail: string,
        @Query('title') title: string,
        @Query('email') email: string,
        // @Query('searchField') searchField: string,
    ) {
        const workshops = await this.adminService.searchWorkshops({title, email});
        return workshops;
     }

    // 유저 및 업체 검색 기능
    @Get('search/members')
    async searchUserOrCompany(
        @Query('email') email: string,
        @Query('company') company: string,
    ) {
        const member = await this.adminService.searchUserOrCompany(email, company)
        return member;
    }
}


