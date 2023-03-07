import { Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { json } from 'stream/consumers';
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
            id,
            data.title,
            data.category,
            data.desc,
            data.thumb,
            data.min_member,
            data.max_member,
            data.total_time,
            data.price,
            data.location
        )
        return {message: "워크숍 수정이 완료되었습니다."}
    }
}


