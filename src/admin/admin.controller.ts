import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

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
}


