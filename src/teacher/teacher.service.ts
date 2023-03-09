import { NumberColorFormat } from '@faker-js/faker';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Company } from 'src/entities/company';
import { GenreTag } from 'src/entities/genre-tag';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(WorkShop) private workshopRepository: Repository<WorkShop>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private genreTagRepository: Repository<GenreTag>,
  ) {}
  async createTeacherRegister(
    id: number,
    phone_number: string,
    address: string,
    name: string,
  ) {
    try {
      const User_id = await this.userRepository.find({
        where: { id,deletedAt:null },
        select: ['id'],
      });
      console.log(User_id)
      this.teacherRepository.insert({
        user_id:id,
        phone_number,
        address,
        name,
      });
      console.log(id)
      // if(User_id === id){
      //   throw new BadRequestException('이미 등록된 강사입니다.')
      // }

      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new error('입력된 요청이 잘못되었습니다.')
    }
  }
  async getTeacherWorkshops(id:number) {
    try {
        const User_id = await this.teacherRepository.findOne({
          where:{user_id:id,deletedAt:null},
          select:['user_id']
        })
        console.log(User_id);
        const test = (id)
        console.log(test)
          let result =  await this.workshopRepository
          .createQueryBuilder('workshop')
          .innerJoinAndSelect('workshop.GenreTag','genreTag')
          .innerJoinAndSelect('workshop.PurposeList','workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag','purposeTag')
          .select([
            'workshop.thumb',
            'workshop.title',
            'workshop.createdAt',
            'workshop.status',
            'genreTag.name',
            'GROUP_CONCAT(purposeTag.name) AS purposeTag_name',
          ])
          .groupBy('workshop.id')
          .getRawMany();
          const results = result.map(workshop =>({
          ...workshop,
          purposeTag_name: workshop.purposeTag_name.split(',')
          }));
          if(id===User_id.user_id){
            return results
          }

        
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  
    async getTeacherMypage(user_id:number) {
      const User_id = await this.teacherRepository.find({
        where:{user_id:user_id},
        select:['user_id']
      })
      console.log(User_id)
      //user_id가 로그인한 user_id와 같으면 그것만 보여주기
      if(User_id){
        let query = this.teacherRepository.createQueryBuilder('teacher');
        query
        .select([
          'teacher.phone_number',
          'teacher.address',
          'teacher.name',
          'user.email',
          'company.*',
          'company.company_type',
          'company.company_name',
          'company.business_number',
          'company.rrn_front',
          'company.rrn_back',
          'company.bank_name',
          'company.account',
          'company.saving_name',
        ])
        .innerJoin('teacher.User','user')
        .innerJoin('teacher.MyCompany','company')
      const Companys = await query.getMany();
      return Companys;
    }
  }
  async createTeacherCompany(
    company_type: number,
    company_name: string,
    business_number: number,
    rrn_front: number,
    rrn_back: number,
    bank_name: string,
    account: number,
    saving_name: string,
    isBan: number,
    user_id:number
  ) {
    try {
      await this.teacherRepository.findOne({
        where:{user_id}
      })
      const Company_name = await this.companyRepository.findOne({
        where: { company_name },
      });
      if (Company_name) {
        throw new BadRequestException('이미 등록된 워크샵입니다.');
      }
      this.companyRepository.insert({
        company_type,
        company_name,
        business_number,
        rrn_front,
        rrn_back,
        bank_name,
        account,
        saving_name,
        isBan,
        user_id:user_id
      });
      // if(user_id){
      //   await this.teacherRepository.update({
      //     id,{affiliation_company_id:1 })
      // }
      
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      // throw new BadRequestException('입력된 요청이 잘못되었습니다.');
      throw error;
    }
  }
  async createTeacherWorkshops(
    category: 'online' | 'offline',
    genre_id: number,
    title: string,
    desc: string,
    thumb: string,
    min_member: number,
    max_member: number,
    total_time: number,
    price: number,
    location: string,
    user_id:number
  ) {
    try {
      await this.teacherRepository.findOne({
        where:{user_id}
      })
      await this.workshopRepository.insert({
        category,
        genre_id,
        title,
        desc,
        thumb,
        min_member,
        max_member,
        total_time,
        price,
        status:"request",
        location,
        user_id:user_id
      });
      return {
        message:
          '워크샵 등록 신청이 완료되었습니다. 관리자의 수락을 기다려 주세요',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  async getTeacherRequest() {
    const request = await this.workshopRepository.find({
      where: { status:'request' },
    });
    
    
    return request;
  }
  async getTeacherComplete() {
    const complete = await this.workshopRepository.find({
      where: { status: 'approval' },
    });
    return complete;
  }
  async updateTeacherAccept(id: number) {
    try {
      const status = await this.workshopRepository.findOne({
        where: { id },
        select:['status']
      });
      if(!status || _.isNil(status)){
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      }
      await this.workshopRepository.update(id,{status:"approval"})
      
      return { message: '워크샵이 수락 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
     
}
  async updateTeacherComplete(id:number) {
    try {
      const status = await this.workshopRepository.findOne({
        where: { id },
        select:['status']
      });
      if(!status || _.isNil(status)){
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      }

      await this.workshopRepository.update(id,{status:"finished"})

      if(status.status !== "finished"){
        throw new UnauthorizedException('이미 워크샵이 종료되었습니다.');
      }
      return { message: '워크샵이 종료 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
}