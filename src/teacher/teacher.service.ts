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
import { CompanyApplication } from 'src/entities/company-application';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { WorkShopInstanceDetail } from 'src/entities/workshop-instance.detail';
import { WorkShopPurpose } from 'src/entities/workshop-purpose';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCompanyDto } from './dto/CreateCompanyDto';
import { CreateTeacherDto } from './dto/createTeacherDto';
import { CreateWorkshopsDto } from './dto/createWorkshopsDto';

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
    @InjectRepository(WorkShopInstanceDetail)
    private workShopInstanceDetailRepository: Repository<WorkShopInstanceDetail>,
    @InjectRepository(CompanyApplication)
    private companyApplicationRepository: Repository<CompanyApplication>,
  ) {}
  // 강사 등록 api

  async createTeacherRegister(
    data: CreateTeacherDto, //user: CurrentUserDto
  ) {
    const { phone_number, address, name } = data;
    // const { id } = user;
    try {
      const id = 11;
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
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 전용 전체 워크샵 목록 api
  async getTeacherWorkshops() {
    // id:number
    try {
      const id = 11; // 예시
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
            'GROUP_CONCAT(purposeTag.name) as purposeTag_name',
          ])
          .groupBy('workshop.id')
          .getRawMany();
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  // 강사 및 업체 정보 api
  async getTeacherMypage() {
    //id: number
    const id = 11;
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
        .leftJoin('teacher.MyCompany', 'company')
        .where('teacher.user_id = :user_id', { user_id: id })
        .select([
          'teacher.phone_number',
          'teacher.address',
          'teacher.name',
          'user.email',
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
  async createTeacherCompany(data: CreateCompanyDto) {
    const {
      company_type,
      company_name,
      business_number,
      rrn_front,
      rrn_back,
      bank_name,
      account,
      saving_name,
    } = data;

    const id = 11; // user_id
    try {
      const userIdInfo = await this.teacherRepository.findOne({
        where: { user_id: id },
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 강사입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const companyId = await this.companyRepository.findOne({
        where: { user_id: id },
        select: ['id'],
      });

      if (companyId) {
        throw new HttpException(
          '이미 등록된 업체입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const Company = await this.companyRepository.insert({
          company_type,
          company_name,
          business_number,
          rrn_front,
          rrn_back,
          bank_name,
          account,
          saving_name,
          isBan: 0,
          user_id: id,
        });
      }
      const companyIds = await this.companyRepository.findOne({
        where: { user_id: id },
        select: ['id'],
      });
      await this.teacherRepository.update(id, {
        affiliation_company_id: companyIds.id,
      });

      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 워크샵 등록
  async createTeacherWorkshops(data: CreateWorkshopsDto) {
    try {
      const {
        thumb,
        title,
        min_member,
        max_member,
        genre_id,
        total_time,
        desc,
        price,
        purpose_tag_id,
      } = data;
      const id = 11;
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
        category: 'offline' || 'online',
        genre_id,
        title,
        desc,
        thumb,
        min_member,
        max_member,
        total_time,
        price,
        status: 'request',
        location: '서울',
        user_id: id,
      });
      await this.workshopRepository.save(workshop);
      const purposeTagIds = purpose_tag_id.map((id) => ({
        workshop_id: workshop.id,
        purpose_tag_id: id,
      }));

      await this.purposeTagIdRepository.insert(purposeTagIds);

      return {
        message:
          '워크샵 등록 신청이 완료되었습니다. 관리자의 수락을 기다려 주세요',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 미완료 워크샵 목록 api
  async getTeacherIncompleteWorkshop() {
    try {
      const id = 11; // 예시
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: id },
        select: ['user_id', 'id'],
      });
      const userIds = userIdInfo.map((info) => info.id);
      console.log(userIds);
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id ', {
            user_id: id,
          })
          .andWhere(
            'workShopInstanceDetail.workshop_id IN (:...workshop_ids)',
            {
              workshop_ids: userIds,
            },
          )
          .andWhere('workShopInstanceDetail.status IN (:...status)', {
            status: ['request', 'non_payment', 'waiting_lecture'],
          })
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect(
            'workshop.WorkShopInstances',
            'workShopInstanceDetail',
          )
          .select([
            'workshop.thumb',
            'workshop.title',
            'workshop.min_member',
            'workshop.max_member',
            'genreTag.name',
            'workshop.total_time',
            'workshop.price',
            'workShopInstanceDetail.id',
            'workShopInstanceDetail.etc',
            'workShopInstanceDetail.company',
            'workShopInstanceDetail.phone_number',
            'workShopInstanceDetail.member_cnt',
            'workShopInstanceDetail.email',
            'workShopInstanceDetail.createdAt',
            'workShopInstanceDetail.status',
          ])
          .getRawMany();
        return result;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 완료 워크샵 목록 api
  async getTeacherComplete() {
    try {
      const id = 11; // 예시
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: id },
        select: ['user_id', 'id'],
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const workshopId = userIdInfo.map((info) => info.id); // id 값을 배열로 변환하여 workshopId 변수에 대입
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id ', {
            user_id: id,
          })
          .andWhere(
            'workShopInstanceDetail.workshop_id  IN (:...workshop_ids) ',
            {
              workshop_ids: workshopId, // workshopId 변수를 사용하여 workshop_id 값을 대입
            },
          )
          .andWhere('workShopInstanceDetail.status = :status', {
            status: 'complete',
          })
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect(
            'workshop.WorkShopInstances',
            'workShopInstanceDetail',
          )
          .select([
            'workshop.thumb',
            'workshop.title',
            'workshop.min_member',
            'workshop.max_member',
            'genreTag.name',
            'workshop.total_time',
            'workshop.price',
            'workShopInstanceDetail.id',
            'workShopInstanceDetail.etc',
            'workShopInstanceDetail.company',
            'workShopInstanceDetail.phone_number',
            'workShopInstanceDetail.member_cnt',
            'workShopInstanceDetail.email',
            'workShopInstanceDetail.createdAt',
            'workShopInstanceDetail.status',
          ])
          .getRawMany();
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 강사 수강 문의 수락하기 api
  async updateTeacherAccept(id: number) {
    try {
      const instanceStatus =
        await this.workShopInstanceDetailRepository.findOne({
          where: { id: id, status: 'request' },
          select: ['status'],
        });
      if (instanceStatus && instanceStatus.status === 'request') {
        await this.workShopInstanceDetailRepository.update(id, {
          status: 'non_payment',
        });
        return { message: '워크샵이 수락 되었습니다.' };
      } else {
        throw new HttpException(
          '이미 수락된 워크샵 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 수강 문의 종료하기 api
  async updateTeacherComplete(id: number) {
    try {
      const instanceStatus =
        await this.workShopInstanceDetailRepository.findOne({
          where: { id: id, status: 'waiting_lecture' },
          select: ['status'],
        });
      if (instanceStatus && instanceStatus.status === 'waiting_lecture') {
        await this.workShopInstanceDetailRepository.update(id, {
          status: 'complete',
        });
        return { message: '워크샵이 종료 되었습니다.' };
      } else {
        throw new HttpException(
          '이미 종료된 워크샵 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
