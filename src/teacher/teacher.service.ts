import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Company } from 'src/entities/company';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  workShopInstanceDetailRepository: any;
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(WorkShop)
    private workshopRepository: Repository<WorkShop>,
  ) {}
  async createTeacherRegister(
    phone_number: string,
    address: string,
    name: string,
  ) {
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
      return { errorMessage: '입력한 요청이 잘못되었습니다.' };
    }
  }
  async getTeacherWorkshops() {
    const workshop = await this.workshopRepository.find({
      where: { deletedAt: null },
      select: ['title', 'thumb', 'genre_id'],
    });
    return workshop;
  }
  async getTeacherMypage() {
    const mypage = await this.teacherRepository.find({
      where: { deletedAt: null },
      select: ['phone_number', 'address', 'name'],
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

  // 강사 미완료 워크샵 목록 api
  async getTeacherIncompleteWorkshop() {
    try {
      const id = 10; // 예시
      const Workshop_id = 83;
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: id },
        select: ['user_id', 'id'],
      });
      const workshopIds = userIdInfo.map((info) => info.id);
      console.log(workshopIds);
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
          .andWhere('workShopInstanceDetail.workshop_id  = :workshop_id ', {
            workshop_id: Workshop_id,
          })
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
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }

  // 강사 완료 워크샵 목록 api
  async getTeacherComplete() {
    try {
      const id = 10; // 예시
      const workshop_id = 83;
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
          .where('workshop.user_id = :user_id ', {
            user_id: id,
          })
          .andWhere('workShopInstanceDetail.workshop_id  = :workshop_id ', {
            workshop_id: workshop_id,
          })
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
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
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
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
}
