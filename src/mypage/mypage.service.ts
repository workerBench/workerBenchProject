import { Injectable } from '@nestjs/common';

@Injectable()
export class MypageService {
    private mypage = [];

    getWorkshops() {
        return this.mypage
    }

}
