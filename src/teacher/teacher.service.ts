import { Injectable } from '@nestjs/common';
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
    @InjectRepository(WorkShop) private workshopRepository: Repository<WorkShop>,
  ) {}
  async createTeacherRegister(
    phone_number: string,
    address: string,
    name: string,
  ) {
    try {
      const user_id = 2
      await this.teacherRepository.insert({
        user_id,
        phone_number,
        address,
        name,
      });
      if(user_id){
          return { errorMessage: "이미 등록된 강사입니다." };
      }

      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      return { errorMessage: '입력한 요청이 잘못되었습니다.' };
    }
  }
  async getTeacherWorkshops() {
    const workshop = await this.workshopRepository.find({
      where: { deletedAt: null },
      select: ['title', 'thumb', 'genre_id',],
    });
    return workshop;
  }
  async getTeacherMypage() {
    const mypage = await this.teacherRepository.find({
      where: { deletedAt: null },
      select: [
        'phone_number',
        'address',
        'name',
        'possession_company_id',
      ],
    });
    await this.companyRepository.find({
      where: {deletedAt: null},
      select: ['company_type','company_name','business_number','rrn_front','rrn_back','bank_name','saving_name']
    })
    return mypage;
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
      return { errorMessage: '입력한 요청이 잘못되었습니다.' };
    }
  }
  createTeacherWorkshops(
    title: string,
    category: string,
    desc: string,
    thumb: string,
    min_member: number,
    max_member: number,
    total_time: number,
    price: number,
    status: string,
    location: string,
  ) {
    // const companyId = this.register.length + 1;
    // this.register.push({id: companyId, title,category,desc,thumb,min_member,max_member,total_time,price,status,location});
    // this.workshopRepository.find({
    //     where: {deletedAt: null},
    //     select: ["id", "title","category","desc","thumb","min_member","max_member","total_time","price","status","location","user_id","genre_id"],
    // })
  }
  getTeacherRequest() {}
  getTeacherComplete() {}
  updateTeacherAccept() {}
  updateTeacherComplete() {}
}
