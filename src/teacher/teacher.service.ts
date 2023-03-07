import { BadRequestException, Injectable } from '@nestjs/common';
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
    id: number,
    phone_number: string,
    address: string,
    name: string,
  ) {
    try {
      const user_id = await this.userRepository.findOne({
        where: { id },
        select: ['id'],
      });
      // const User_id = await this.teacherRepository.findOne({
      //   where:{user_id:id}
      // })
      // if(user_id){
      //   throw new BadRequestException('이미 등록된 강사입니다.');
      // }
      await this.teacherRepository.insert({
        user_id: user_id.id,
        phone_number,
        address,
        name,
      });
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
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
        select: ['phone_number', 'address', 'name', 'possession_company_id'],
      });
      await this.companyRepository.find({
        where: { deletedAt: null },
        select: [
          'company_type',
          'company_name',
          'business_number',
          'rrn_front',
          'rrn_back',
          'bank_name',
          'saving_name',
        ],
      });
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
        where:{ company_name },
      })
      if(Company_name){
        throw new BadRequestException('이미 등록된 워크샵입니다.');
      }
      await this.companyRepository.insert({
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
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
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
      return { message: '워크샵 등록 신청이 완료되었습니다. 관리자의 수락을 기다려 주세요' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  getTeacherRequest() {}
  getTeacherComplete() {}
  updateTeacherAccept() {}
  updateTeacherComplete() {}
}
