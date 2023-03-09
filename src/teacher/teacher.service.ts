import { NumberColorFormat } from '@faker-js/faker';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { Company } from 'src/entities/company';
import { GenreTag } from 'src/entities/genre-tag';
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

  // 강사 등록 api
  async createTeacherRegister(
    id: number,
    phone_number: string,
    address: string,
    name: string,
  ) {
    try {
      // userRepository에서 id를 찾는다.
      const userIdInfo = await this.userRepository.findOne({
        where: { id },
        select: ['id'],
      });
      // id가 없으면 에러를 띄운다.
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // teacherRepository에서 user_id를 찾는다.
      const teacherid = await this.teacherRepository.findOne({
        where: { user_id: id },
        select: ['user_id'],
      });
      // user_id가 있다면 등록된 강사이다.
      if (teacherid) {
        throw new HttpException(
          '이미 등록된 강사입니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      // user_id가 없다면 teacherRepository에 생성한다.
      else {
        await this.teacherRepository.insert({
          user_id: id,
          phone_number,
          address,
          name,
        });
      }
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 강사 전용 전체 워크샵 목록 api
  async getTeacherWorkshops(id: number) {
    try {
      // workshopRepository에서 user_id를 찾는다.
      const userIdInfo = await this.workshopRepository.findOne({
        where: { user_id: id },
        select: ['user_id'],
      });
      // user_id가 없으면 에러를 띄운다.
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // user_id가 있으면 workshopRepository에 생성한다.
      else {
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .where('workshop.user_id = :user_id', { user_id: id })
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
        result.map((workshop) => ({
          ...workshop,
          purposeTag_name: workshop.purposeTag_name.split(','),
        }));
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  // 강사 전용 마이 페이지 api
  async getTeacherMypage(id: number) {
    // teacherRepository 에서 user_id를 찾는다.
    const userIdInfo = await this.teacherRepository.findOne({
      where: { user_id: id },
      select: ['user_id'],
    });
    // user_id가 없드면 에러를 띄띄운다.
    if (!userIdInfo) {
      throw new HttpException(
        '등록되지 않은 유저 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // user_id가 있으면 teacherRepository에 생성한다.
    else {
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
  async createTeacherCompany(data: createCompanyDto, user_id: CurrentUserDto) {
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
    const { id } = user_id;
    try {
      // companyRepository 에서 user_id에 맞는 companyId를 찾는다.
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
      //  teacherRepository 에서 user_id를 찾는다.
      const userIdInfo = await this.teacherRepository.findOne({
        where: { user_id: id },
      });
      //
      // user_id가 있다면 생성한다.
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

      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      // throw new BadRequestException('입력된 요청이 잘못되었습니다.');
      throw error;
    }
  }

  // 강사 워크샵 등록 api
  async createTeacherWorkshops(data: createWorkshopsDto, user: CurrentUserDto) {
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
      const { id } = user;
      // teacherRepository에서 user_id를 찾는다.
      const teacherInfo = await this.teacherRepository.findOne({
        where: { user_id: id },
      });
      // user_id가 없으면 에러를 띄운다.
      if (!teacherInfo) {
        throw new HttpException(
          '등록된 강사가 아닙니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      // workshopRepository에서 워크샵을 등록한 user_id를 찾는다.
      const userId = await this.workshopRepository.findOne({
        where: { user_id: id },
      });

      // user_id가 없으면 workshop을 등록한다
      if (!userId)
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
          status: 'request',
          location,
          user_id: id,
        });
      // 등록된 워크샵이 없으면 에러를 띄운다.
      else {
        throw new HttpException(
          '이미 등록된 워크샵 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // workshopRepository에서 workshopId 찾는다.
      const workshopId = await this.workshopRepository.findOne({
        where: { user_id: id },
        select: ['id'],
      });
      // purposeTagRepository에서 purposeTagId를 찾는다.
      const purposeTagId = await this.purposeTagRepository.findOne({
        where: { deletedAt: null },
        select: ['id'],
      });
      //찾은 workshopId와 purposeTagId를 생성한다.
      this.purposeTagIdRepository.insert({
        workshop_id: workshopId.id,
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
  async getTeacherRequest(id: number) {
    // workshopRepository에서 user_id가 id이고 status가 request를 찾는다.
    const request = await this.workshopRepository.find({
      where: { user_id: id, status: 'request' },
    });
    return request;
  }

  // 강사 완료 워크샵 보기 api
  async getTeacherComplete(id: number) {
    // workshopRepository에서 user_id가 id이고 status가 approval를 찾는다.
    const complete = await this.workshopRepository.find({
      where: { user_id: id, status: 'approval' },
    });
    return complete;
  }

  // 강사 수강 문의 수락하기 api
  async updateTeacherAccept(id: number) {
    try {
      // workshopRepository에서 user_id가 id인 status를 찾는다
      const status = await this.workshopRepository.findOne({
        where: { id },
        select: ['status'],
      });
      // 만약 스테이터스가 없으면 에러를 띄운다.
      if (!status) {
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      }
      // 있다면 status를 approval로 변경한다.
      else {
        await this.workshopRepository.update(id, { status: 'approval' });
      }
      return { message: '워크샵이 수락 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  //강사 수강 문의 종료하기 api
  async updateTeacherComplete(id: number) {
    try {
      // workshopRepository에서 id찾고 해당하는 status를 찾는다.
      const status = await this.workshopRepository.findOne({
        where: { id },
        select: ['status'],
      });
      // 만약 status가 없아면 에러를 띄운다.
      if (!status) {
        throw new NotFoundException('등록된 워크샵이 없습니다.');
      }
      // 있으면 status를 finished로 변경한다.
      else {
        await this.workshopRepository.update(id, { status: 'finished' });
      }
      return { message: '워크샵이 종료 되었습니다.' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
}
