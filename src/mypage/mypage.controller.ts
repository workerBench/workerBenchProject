import { Controller, Get } from '@nestjs/common';

@Controller('mypage')
export class MypageController { 
    mypageService: MypageService; 

    constructor(mypageService: MypageService) {
        this.mypageService = mypageService;
    }
}
