import { Controller, Get, Render } from "@nestjs/common";

@Controller('admin')
export class AdminControllerRender {

    // ----------------- 워크숍 관리 페이지 렌더 ----------------- //

    @Get('/workshops-request')
    @Render('admin/workshops-request')
    request_workshops_data() {
    }

    @Get('/workshops-approval')
    @Render('admin/workshops-approval')
    approval_workshops_data() {
    }

    @Get('/workshops-finished')
    @Render('admin/workshops-finished')
    finished_workshops_data() {
    }

    // ----------------- 유저 및 업체 관리 페이지 렌더 ----------------- //

    @Get('/black-register')
    @Render('admin/black-register')
    black_register_data() {
    }

    @Get('/black-list')
    @Render('admin/black-list')
    black_list_data() {
    }

    // ----------------- 관리자 계정 관리 페이지 렌더 ----------------- //

    @Get('/admin-manage')
    @Render('admin/admin-manage')
    admin_manage_data() {
    }
}