import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from 'src/entities/admin-user';
import { Company } from 'src/entities/company';
import { User } from 'src/entities/user';
import { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(WorkShop) private workshopRepository: Repository<WorkShop>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        @InjectRepository(AdminUser) private adminUserRepository: Repository<AdminUser>
    ) {}

    //-------------------------- 검토 대기중인 워크숍 목록 불러오기 --------------------------//

    async requestWorkshops() {
        return await this.workshopRepository.find({
            where:{status:"request", deletedAt: null}
        })
    }

    //-------------------------- 워크숍 승인하기 (status:"request" => "approval") --------------------------//

    async approveWorkshop(id: number) {
        const workshop = await this.workshopRepository.findOne({
            where:{id, status:"request", deletedAt: null}
        })
        if(!workshop || workshop.status !== "request") {
            throw new NotFoundException("없는 워크숍입니다.")
        }
        return await this.workshopRepository.update(id, {status:"approval"})
    }

    //-------------------------- 워크숍 반려하기 (status:"request" => "rejected") --------------------------//

    async rejectWorkshop(id: number) {
        const workshop = await this.workshopRepository.findOne({
            where:{id, status:"request", deletedAt: null}
        })
        
        if(!workshop || workshop.status !== "request") {
            throw new NotFoundException("없는 워크숍입니다.")
        }
        return await this.workshopRepository.update(id, {status:"rejected"})
    }

    //-------------------------- 승인된 워크숍 목록 불러오기 (status: "approval") --------------------------//

    async getApprovedWorkshops() {
        return await this.workshopRepository.find({
            where: {status:"approval", deletedAt: null}
        })
    }

    //-------------------------- 워크숍 수정하기 --------------------------//

    async updateWorkshop(
        id: number, 
        title: string, 
        category: "online" | "offline", 
        desc: string, 
        thumb: string,
        min_member: number,
        max_member: number,
        total_time: number,
        price: number,
        location: string,
        ) {
            const workshop = await this.workshopRepository.findOne({
                where:{id, status: "approval", deletedAt: null}
            })

            if(!workshop || workshop.status !== "approval") {
                throw new NotFoundException("없는 워크숍입니다.")
            }

            return await this.workshopRepository.update(id, {
                title, category, desc, thumb, min_member, max_member, total_time, price, location
            })
        }

    //-------------------------- 워크숍 삭제하기 (status: "approval" => "finished") --------------------------//

    async removeWorkshop(id: number) {
        const workshop = await this.workshopRepository.findOne({
            where: {id, status: "approval"}
        })

        if(!workshop || workshop.status !== "approval") {
            throw new NotFoundException("없는 워크숍입니다.")
        }

        await this.workshopRepository.update(id, {status:"finished"})

        return await this.workshopRepository.softDelete(id)
    }

    //-------------------------- 유저 밴 처리하기 (isBam : 0 => 1) --------------------------//

    async userBan(id: number) {
        const user = await this.userRepository.findOne({
            where:{id}
        })

        return await this.userRepository.update(id, {isBan: 1})
    }

    //-------------------------- 업체 밴 처리하기 (isBam : 0 => 1) --------------------------//

    async companyBan(id: number) {
        const company = await this.companyRepository.findOne({
            where:{id}
        })
        
        return await this.companyRepository.update(id, {isBan: 1})
    }

    //-------------------------- 현재 관리자 목록 불러오기 --------------------------//

    async getAdminList() {
        return await this.adminUserRepository.find({
            where: {admin_type: 0}
        })
    }

    //-------------------------- 워크숍 검색 기능 (유저 이메일 / 워크숍 타이틀) --------------------------//

    async searchWorkshops(titleOrEmail: string, searchField: string) {
        let query = this.workshopRepository
        .createQueryBuilder('w')
        .select([
            'w.title', 
            'w.category', 
            'w.desc', 
            'w.thumb', 
            'w.min_member', 
            'w.max_member', 
            'w.total_time', 
            'w.price', 
            'w.location',
            'genre.name',
            `GROUP_CONCAT(perposetag.name SEPARATOR ',') AS perpose_name`,
            'user.email',
        ])
        .innerJoin('w.GenreTag', 'genre')
        .innerJoin('w.PurposeList', 'perpose')
        .innerJoin('perpose.PurPoseTag', 'perposetag')
        .innerJoin('w.User', 'user');
      
        if (searchField === 'title') {
          query = query
        //   .innerJoinAndSelect('workshop.User', "user")
          .where('w.title LIKE :title', { title: `%${titleOrEmail}%` })
        } else if (searchField === 'email') {
            query = query
            // .innerJoinAndSelect('workshop.User', 'user')
            .where('user.email = :email', { email: `${titleOrEmail}` });
        }
      
        const workshops = await query.getRawMany();
        return workshops;
      }

    //-------------------------- 업체 및 강사 검색 기능 (유저 이메일 / 업체 명) --------------------------//
    
    async searchUserOrCompany(EmailOrCompany:string, searchcField: string) {
        let query: SelectQueryBuilder<User> | SelectQueryBuilder<Company>

        if (searchcField === 'email') {
            query = this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', {email: `${EmailOrCompany}`});
        } else if (searchcField === "company") {
            query = this. companyRepository
            .createQueryBuilder('company')
            .where('company.company_name Like :company_name', {company_name: `%${EmailOrCompany}%`})
        }

        const result = await query.getMany()
        return result
    }
}