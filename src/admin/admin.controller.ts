import { Controller, Get } from '@nestjs/common';
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
}


