import { Controller, Get } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';

@Controller('/api/mypage')
export class MypageController {      
    constructor(private readonly MypageService: MypageService) {}
        
    @Get()
    getAllpages() {
        return this.MypageService.getAllPages();
    }
    
}
