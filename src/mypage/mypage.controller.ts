import { Controller, Get } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';

@Controller('mypage')
export class MypageController { 

        @Get()
        getAll() {
            return 'here is mypage';
        }

    constructor(private readonly MypageService: MypageService) {
        this.MypageService = MypageService;
    }
}
