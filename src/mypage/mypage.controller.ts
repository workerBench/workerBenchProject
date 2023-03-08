import { Controller, Get, Post, Param } from '@nestjs/common';
import { MypageService } from 'src/mypage/mypage.service';

@Controller('/api/mypage')
export class MypageController {      
    constructor(private readonly MypageService: MypageService) {}
        
    @Get('/:id/Workshops')
    GetWorkshops(@Param('id') id: number) {
      return this.mypageService.getWorkshops(id);
    }
    
}
