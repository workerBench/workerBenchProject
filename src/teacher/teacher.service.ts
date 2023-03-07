import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Company } from 'src/entities/company';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(WorkShop)
    private workshopRepository: Repository<WorkShop>,
  ) {}
  async createTeacherRegister(
    user_id: number,
    phone_number: string,
    address: string,
    name: string,
  ) {
    try {
      // const user_id = await this.userRepository.findOne({
      //   where: { id },
      //   select: ['id'],
      // });
      const User_id = await this.teacherRepository.findOne({
        where:{user_id:user_id}
      })
      if(User_id){
        throw new UnauthorizedException('이미 등록된 강사입니다.');
      }
      this.teacherRepository.insert({
        user_id:user_id,
        phone_number,
        address,
        name,
      });
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new error('입력된 요청이 잘못되었습니다.')
    }
  }
  async getTeacherWorkshops() {
    try {
      const workshop = await this.workshopRepository.find({
        where: { deletedAt: null },
        select: ['title', 'thumb', 'genre_id'],
      });
      return workshop;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  async getTeacherMypage() {
    try {
      const mypage = await this.teacherRepository.find({
        where: { deletedAt: null },
        select: ['phone_number', 'address', 'name'],
      });
      // await this.companyRepository.find({
      //   where: { deletedAt: null },
      //   select: [
      //     'company_type',
      //     'company_name',
      //     'business_number',
      //     'rrn_front',
      //     'rrn_back',
      //     'bank_name',
      //     'saving_name',
      //   ],
      // });
      return mypage;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
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
    user_id: number,
  ) {
    try {
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
        user_id,
      });
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      // throw new BadRequestException('입력된 요청이 잘못되었습니다.');
      throw error;
    }
  }
  async createTeacherWorkshops(
    category: string,
    genre_id: number,
    title: string,
    desc: string,
    thumb: string,
    min_member: number,
    max_member: number,
    total_time: number,
    price: number,
    location: string,
  ) {
    try {
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
      where: { status: 'complete' },
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
      await this.workshopRepository.update(id,{status:"complete"})
      if(status.status !== "complete"){
        throw new UnauthorizedException('이미 워크샵이 수락되었습니다.');
      }
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