import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { Company } from 'src/entities/company';
import { PurposeTag } from 'src/entities/purpose-tag';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopPurpose } from 'src/entities/workshop-purpose';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { createCompanyDto } from './dto/CreateCompanyDto';
import { createTeacherDto } from './dto/createTeacherDto';
import { createWorkshopsDto } from './dto/createWorkshopsDto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(WorkShop)
    private workshopRepository: Repository<WorkShop>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(WorkShopPurpose)
    private purposeTagIdRepository: Repository<WorkShopPurpose>,
    @InjectRepository(PurposeTag)
    private purposeTagRepository: Repository<PurposeTag>,
  ) {}
  // 안되는것 : 강사 전용 전체 워크샵 목록 에서 같은 user_id에서 내용이 다른 워크샵을 등록하면 내용이 안바뀜 purposeTag만 바뀜
  // 워크샵 등록할때 purposeTag가 여러개 있을시 여러개를 동시에 등록을 못함
  // 강사 등록 api
  async createTeacherRegister(
    data: createTeacherDto, //user: CurrentUserDto
  ) {
    const { phone_number, address, name } = data;
    // const { id } = user;
    try {
      const id = 10;
      const userIdInfo = await this.userRepository.findOne({
        where: { id },
        select: ['id'],
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const teacherid = await this.teacherRepository.findOne({
        where: { user_id: id },
        select: ['user_id'],
      });
      if (teacherid) {
        throw new HttpException(
          '이미 등록된 강사입니다',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.teacherRepository.insert({
          user_id: id,
          phone_number,
          address,
          name,
        });
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 강사 전용 전체 워크샵 목록 api
  async getTeacherWorkshops() {
    // id:number
    try {
      const id = 10; // 예시
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: id },
        select: ['user_id'],
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id', { user_id: id })
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .select([
            'workshop.thumb',
            'workshop.title',
            'workshop.createdAt',
            'workshop.status',
            'genreTag.name',
            'purposeTag.name',
          ])
          .getRawMany();
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 강사 전용 마이 페이지 api
  async getTeacherMypage() {
    //id: number
    const id = 10;
    const userIdInfo = await this.teacherRepository.findOne({
      where: { user_id: id },
      select: ['user_id'],
    });
    if (!userIdInfo) {
      throw new HttpException(
        '등록되지 않은 유저 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      let query = this.teacherRepository
        .createQueryBuilder('teacher')
        .innerJoin('teacher.User', 'user')
        .innerJoin('teacher.MyCompany', 'company')
        .where('teacher.user_id = :user_id', { user_id: id })
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
        ]);
      const Companys = await query.getMany();
      return Companys;
    }
  }

  // 강사 업체 등록 api
  async createTeacherCompany(
    data: createCompanyDto, //user_id: CurrentUserDto
  ) {
    const {
      company_type,
      company_name,
      business_number,
      rrn_front,
      rrn_back,
      bank_name,
      account,
      saving_name,
      isBan,
    } = data;
    // const { id } = user_id;
    try {
      const id = 10;
      const companyId = await this.companyRepository.findOne({
        where: { user_id: id },
        select: ['id'],
      });
      // companyId가 있다면
      if (companyId) {
        throw new HttpException(
          '이미 등록된 업체 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const userIdInfo = await this.teacherRepository.findOne({
        where: { user_id: id },
      });
      if (userIdInfo) {
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
          user_id: id,
        });
        await this.teacherRepository.update(id, {
          affiliation_company_id: 1,
        });
      } else {
        throw new HttpException(
          '등록 되지 않은 강사입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return data; //{ message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      // throw new BadRequestException('입력된 요청이 잘못되었습니다.');
      throw error;
    }
  }

  // 강사 워크샵 등록 api
  async createTeacherWorkshops(data: createWorkshopsDto) {
    try {
      const {
        category,
        genre_id,
        title,
        desc,
        thumb,
        min_member,
        max_member,
        total_time,
        price,
        location,
      } = data;
      const id = 10;
      const teacherInfo = await this.teacherRepository.findOne({
        where: { user_id: id },
      });
      if (!teacherInfo) {
        throw new HttpException(
          '등록된 강사가 아닙니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const workshopsInfo = await this.workshopRepository.findOne({
        where: { user_id: id, title },
      });
      if (workshopsInfo) {
        throw new HttpException(
          '이미 등록된 제목 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const workshop = this.workshopRepository.create({
        category,
        genre_id,
        title,
        desc,
        thumb,
        min_member,
        max_member,
        total_time,
        price,
        status: 'request',
        location,
        user_id: id,
      });
      await this.workshopRepository.save(workshop);
      const purposeTagId = await this.purposeTagRepository.findOne({
        where: { deletedAt: null },
        select: ['id'],
      });
      this.purposeTagIdRepository.insert({
        workshop_id: workshop.id,
        purpose_tag_id: purposeTagId.id,
      });
      return {
        message:
          '워크샵 등록 신청이 완료되었습니다. 관리자의 수락을 기다려 주세요',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 강사 미완료 워크샵 보기 api
  async getTeacherRequest() {
    //id: number
    const id = 10;
    const request = await this.workshopRepository.find({
      where: { user_id: id, status: 'request' },
    });
    return request;
  }

  // 강사 완료 워크샵 보기 api
  async getTeacherComplete() {
    // id: number
    const id = 10;
    const complete = await this.workshopRepository.find({
      where: { user_id: id, status: 'approval' },
    });
    return complete;
  }

  async updateTeacherAccept(id: number) {
    try {
      const status = await this.workshopRepository.findOne({
        where: { id },
        select: ['status'],
      });
      if (!status) {
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      } else {
        await this.workshopRepository.update(id, { status: 'approval' });
      }
      return { message: '워크샵이 수락 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 강사 수강 문의 종료하기 api
  async updateTeacherComplete(id: number) {
    try {
      const status = await this.workshopRepository.findOne({
        where: { id },
        select: ['status'],
      });
      if (!status) {
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      } else {
        await this.workshopRepository.update(id, { status: 'finished' });
      }
      return { message: '워크샵이 종료 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 강사 수강 문의 반려하기
  async updateTeacherRejected(id: number) {
    try {
      const status = await this.workshopRepository.findOne({
        where: { id },
        select: ['status'],
      });
      if (!status) {
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      } else {
        await this.workshopRepository.update(id, { status: 'rejected' });
      }
      return { message: '워크샵이 반려 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
}
