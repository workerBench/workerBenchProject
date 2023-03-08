import { Injectable } from '@nestjs/common';

@Injectable()
export class MypageService {
    private mypage = [];

    getAllPages() {
        return this.mypage
    }

}
