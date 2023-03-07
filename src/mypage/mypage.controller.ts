import { Controller, Get } from '@nestjs/common';

@Controller('mypage')
export class MypageController { 
    @Get() 
    getAll() {
        return 'here is mypage';
    }    
}
