import { Controller, Get, Render } from "@nestjs/common";

@Controller('admin')
export class AdminControllerRender {
    @Get('/admin-manage')
    @Render('admin/admin-manage')
    admin_manage_data() {
    }

    @Get('/request-workshops-list')
    @Render('admin/request-workshops-list')
    request_workshops_list_data() {
    }

    @Get('/workshops-manage')
    @Render('admin/workshops-manage')
    workshops_manage_data() {
    }

    @Get('/user-or-company-manage')
    @Render('admin/user-or-company-manage')
    user_or_company_manage_data() {
    }
}