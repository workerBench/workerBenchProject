import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('/workshops/request')
    async requestWorkshops() {
        const requestWorkshops = await this.adminService.requestWorkshops()

        return requestWorkshops
    }
}


