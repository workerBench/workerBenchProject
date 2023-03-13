import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUser } from 'src/entities/admin-user';
import { Company } from 'src/entities/company';
import { User } from 'src/entities/user';
import { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { WorkShop } from '../entities/workshop';
import { editWorkshopDto } from './dto/edit-workshop.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(WorkShop) private workshopRepository: Repository<WorkShop>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Company) private companyRepository: Repository<Company>,
        @InjectRepository(AdminUser) private adminUserRepository: Repository<AdminUser>
    ) {}

        //-------------------------- 워크숍 검색 기능 (유저 이메일 / 워크숍 타이틀) --------------------------//

        // requst 워크숍 검색
    async searchRequestWorkshops(options: { email : string, title : string }) {
        let query = this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.status = :status', { status: 'request' })
          .innerJoinAndSelect('workshop.GenreTag', 'genre')
          .innerJoinAndSelect('workshop.PurposeList', 'purpose')
          .innerJoinAndSelect('purpose.PurPoseTag', 'purposetag')
          .innerJoinAndSelect('workshop.User', 'user')
          .select([
            'workshop.title', 
            'workshop.category', 
            'workshop.desc', 
            'workshop.thumb', 
            'workshop.min_member', 
            'workshop.max_member', 
            'workshop.total_time',
            'workshop.price', 
            'workshop.location',
            'workshop.status',
            'genre.name',
          ])
          .orderBy('workshop.id')
      
        if (options.title) {
            query
            .andWhere('workshop.title LIKE :title', { title: `%${options.title}%` })
        }
        if (options.email) {
            query
            .andWhere('user.email = :email', { email: `${options.email}` })
        }


        const workshops = await query.getMany();
      
        return workshops
    }

    // approval 워크숍 검색
    async searchApprovalWorkshops(options: { email : string, title : string }) {
        let query = this.workshopRepository
            .createQueryBuilder('workshop')
            .where('workshop.status = :status', { status: 'approval' })
            .innerJoinAndSelect('workshop.GenreTag', 'genre')
            .innerJoinAndSelect('workshop.PurposeList', 'purpose')
            .innerJoinAndSelect('purpose.PurPoseTag', 'purposetag')
            .innerJoinAndSelect('workshop.User', 'user')
            .select([
            'workshop.title', 
            'workshop.category', 
            'workshop.desc', 
            'workshop.thumb', 
            'workshop.min_member', 
            'workshop.max_member', 
            'workshop.total_time',
            'workshop.price', 
            'workshop.location',
            'workshop.status',
            'genre.name',
            ])
            .orderBy('workshop.id')
        
        if (options.title) {
            query
            .andWhere('workshop.title LIKE :title', { title: `%${options.title}%` })
        }
        if (options.email) {
            query
            .andWhere('user.email = :email', { email: `${options.email}` })
        }


        const workshops = await query.getMany();
        
        return workshops
    }

    // finished 워크숍 검색
    async searchFinishedWorkshops(options: { email : string, title : string }) {
        let query = this.workshopRepository
            .createQueryBuilder('workshop')
            .withDeleted()
            .where('workshop.status = :status', { status: 'finished' })
            .innerJoinAndSelect('workshop.GenreTag', 'genre')
            .innerJoinAndSelect('workshop.PurposeList', 'purpose')
            .innerJoinAndSelect('purpose.PurPoseTag', 'purposetag')
            .innerJoinAndSelect('workshop.User', 'user')
            .select([
            'workshop.title', 
            'workshop.category', 
            'workshop.desc', 
            'workshop.thumb', 
            'workshop.min_member', 
            'workshop.max_member', 
            'workshop.total_time',
            'workshop.price', 
            'workshop.location',
            'workshop.status',
            'genre.name',
            ])
            .orderBy('workshop.id')
        
        if (options.title) {
            query
            .andWhere('workshop.title LIKE :title', { title: `%${options.title}%` })
        }
        if (options.email) {
            query
            .andWhere('user.email = :email', { email: `${options.email}` })
        }


        const workshops = await query.getMany();
        
        return workshops
    }


    //-------------------------- 검토 대기중인 워크숍 목록 불러오기 (status: "request") --------------------------//

    async requestWorkshops() {
        return await this.workshopRepository.find({
            where:{status:"request", deletedAt: null}
        })
    }

    //-------------------------- 승인된 워크숍 목록 불러오기 (status: "approval") --------------------------//

    async getApprovedWorkshops() {
        return await this.workshopRepository.find({
            where: {status:"approval", deletedAt: null}
        })
    }

    //-------------------------- 종료된 워크숍 목록 불러오기 (status: "finished") --------------------------//

    async getFinishedWorkshops() {
        return await this.workshopRepository.createQueryBuilder('workshop')
        .withDeleted()
        .where('workshop.status = :status', { status: 'finished' })
        .getMany();
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

    //-------------------------- 워크숍 수정하기 --------------------------//

    async updateWorkshop(
        data: editWorkshopDto,
        id: number, 
        ) {
            const { title, category, desc, thumb, min_member, max_member, total_time, price, location } = data
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



    
    //-------------------------- 업체 및 강사 검색 기능 (유저 이메일 / 업체 명) --------------------------//
    
    async searchUserOrCompany(email:string, company: string) {
        let query: SelectQueryBuilder<User> | SelectQueryBuilder<Company>

        if (email) {
            query = this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', {email: `${email}`})
            .andWhere('user.isBan = :isBan', {isBan: 0})
        }
        if (company) {
            query = this. companyRepository
            .createQueryBuilder('company')
            .where('company.company_name Like :company_name', {company_name: `%${company}%`})
            .andWhere('company.isBan = :isBan', {isBan: 0})
        }

        const result = await query.getMany()
        return result
    }

    //-------------------------- 밴 처리된 업체/유저 목록 불러오기 --------------------------//

    async userBanList() {
        const user = await this.userRepository.find({
            where: {isBan: 1}
        })
        return user
    }

    async companyBanList() {
        const company = await this.companyRepository.find({
            where: {isBan: 1}
        })
        return company
    }
    
    //-------------------------- 유저 밴 처리하기 (isBam : 0 => 1) --------------------------//

    async userBan(id: number) {
        const user = await this.userRepository.findOne({
            where:{id, isBan : 0}
        })

        return await this.userRepository.update(id, {isBan: 1})
    }

    //-------------------------- 유저 밴 해제하기 (isBam : 1 => 0) --------------------------//

    async userUnban(id: number) {
        const user = await this.userRepository.findOne({
            where: {id, isBan: 1}
        })

        return await this.userRepository.update(id, {isBan : 0} )
    }

    //-------------------------- 업체 밴 처리하기 (isBam : 0 => 1) --------------------------//

    async companyBan(id: number) {
        const company = await this.companyRepository.findOne({
            where:{id, isBan: 0}
        })
        
        return await this.companyRepository.update(id, {isBan: 1})
    }

    //-------------------------- 업체 밴 해제하기 (isBam : 1 => 0) --------------------------//

    async companyUnban(id: number) {
        const company = await this.companyRepository.findOne({
            where: {id, isBan: 1}
        })

        return await this.companyRepository.update(id, {isBan : 0} )
    }

    //-------------------------- 현재 관리자 목록 불러오기 --------------------------//

    async getAdminList() {
        return await this.adminUserRepository.find({
            where: {admin_type: 0}
        })
    }
      
}