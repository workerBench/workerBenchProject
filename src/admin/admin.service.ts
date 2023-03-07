import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(WorkShop) private workshopRepository: Repository<WorkShop>
    ) {}

    //-------------------------- 검토 대기중인 워크숍 목록 불러오기 --------------------------//

    async requestWorkshops() {
        return await this.workshopRepository.find({
            where:{status:"request"}
        })
    }

    //-------------------------- 워크숍 승인하기 (status:"request" => "approval") --------------------------//

    async approveWorkshop(id: number) {
        const workshop = await this.workshopRepository.findOne({
            where:{id, status:"request"}
        })
        if(!workshop || workshop.status !== "request") {
            throw new NotFoundException("없는 워크숍입니다.")
        }
        return await this.workshopRepository.update(id, {status:"approval"})
    }

    //-------------------------- 워크숍 반려하기 (status:"request" => "rejected") --------------------------//

    async rejectWorkshop(id: number) {
        const workshop = await this.workshopRepository.findOne({
            where:{id, status:"request"}
        })
        
        if(!workshop || workshop.status !== "request") {
            throw new NotFoundException("없는 워크숍입니다.")
        }
        return await this.workshopRepository.update(id, {status:"rejected"})
    }

    //-------------------------- 승인된 워크숍 목록 불러오기 (status: "approval") --------------------------//

    async getApprovedWorkshops() {
        return await this.workshopRepository.find({
            where: {status:"approval"}
        })
    }
}