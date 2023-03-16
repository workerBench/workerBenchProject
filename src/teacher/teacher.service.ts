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
import { CreateCompanyDto } from './dto/teacher-company.dto';
import { CreateTeacherDto } from './dto/teacher.dto';
import { CreateWorkshopsDto } from './dto/teacher-workshops.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { WorkShopImage } from 'src/entities/workshop-image';
import { identity } from 'rxjs';

@Injectable()
export class TeacherService {
  private readonly s3Client: S3Client;
  public readonly S3_BUCKET_NAME: string;
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
    @InjectRepository(WorkShopImage)
    private workshopImageRepository: Repository<WorkShopImage>,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME');
  }
  // 강사 등록 api

  async createTeacherRegister(data: CreateTeacherDto, userId: number) {
    const { phone_number, address, name } = data;
    try {
      const userIdInfo = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id'],
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 유저 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const teacherid = await this.teacherRepository.findOne({
        where: { user_id: userId },
        select: ['user_id'],
      });
      if (teacherid) {
        throw new HttpException(
          '이미 등록된 강사입니다',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.teacherRepository.insert({
          user_id: userId,
          phone_number,
          address,
          name,
        });
        await this.userRepository.update(userId, { user_type: 1 });
      }

      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 전용 전체 워크샵 목록 api
  async getTeacherWorkshops(userId: number) {
    try {
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: userId },
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
          .where('workshop.user_id = :user_id', { user_id: userId })
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .select([
            'workshop.id',
            'workshop.thumb',
            'workshop.title',
            'workshop.createdAt',
            'workshop.status',
            'genreTag.name',
            'GROUP_CONCAT(purposeTag.name) as purposeTag_name',
          ])
          .groupBy('workshop.id')
          .getRawMany();

        return result.map((workshop) => {
          return {
            ...workshop,
            workshop_thumb: `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN',
            )}images/workshops/${workshop.workshop_id}/800/${
              workshop.workshop_thumb
            }`,
          };
        });
        return result;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException('입력된 요청이 잘못되었습니다.');
    }
  }
  // 강사 및 업체 정보 api
  async getTeacherMypage(userId: number) {
    const userIdInfo = await this.teacherRepository.findOne({
      where: { user_id: userId },
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
        .where('teacher.user_id = :user_id', { user_id: userId })
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
  async createTeacherCompany(data: CreateCompanyDto, userId: number) {
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

    try {
      const userIdInfo = await this.teacherRepository.findOne({
        where: { user_id: userId },
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 강사입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const companyId = await this.companyRepository.findOne({
        where: { user_id: userId },
        select: ['id'],
      });

      if (companyId) {
        throw new HttpException(
          '이미 등록된 업체입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const company = await this.companyRepository.create({
          company_type,
          company_name,
          business_number,
          rrn_front,
          rrn_back,
          bank_name,
          account,
          saving_name,
          isBan: 0,
          user_id: userId,
        });
        await this.companyRepository.save(company);
      }
      const newCompanyId = await this.companyRepository.findOne({
        where: { user_id: userId },
        select: ['id'],
      });
      if (newCompanyId) {
        await this.companyApplicationRepository.insert({
          teacher_id: userId,
          company_id: newCompanyId.id,
        });
      }
      await this.teacherRepository.update(userId, {
        affiliation_company_id: newCompanyId.id,
      });
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 워크샵 등록
  async createTeacherWorkshops(
    data: CreateWorkshopsDto,
    images: Array<Express.Multer.File>,
    userId: number,
  ) {
    try {
      const {
        title,
        min_member,
        max_member,
        genre_id,
        total_time,
        desc,
        price,
        location,
        purpose_tag_id,
      } = data;
      const teacherInfo = await this.teacherRepository.findOne({
        where: { user_id: userId },
      });
      if (!teacherInfo) {
        throw new HttpException(
          '등록된 강사가 아닙니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const workshopsInfo = await this.workshopRepository.findOne({
        where: { user_id: userId, title },
      });
      if (workshopsInfo) {
        throw new HttpException(
          '이미 등록된 제목 입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 썸네일 이미지 이름 만들기. 프론트에서는 썸네일을 가장 먼저 formData 에 저장하기에 무조건 배열의 첫 번째 사진이 썸네일.
      const thumbImgType = images[0].originalname.substring(
        images[0].originalname.lastIndexOf('.'),
        images[0].originalname.length,
      );
      const thumbImgName = uuid() + thumbImgType;

      const workshop = await this.workshopRepository.insert({
        thumb: thumbImgName,
        category: 'offline' || 'online',
        title,
        min_member,
        max_member,
        genre_id,
        total_time,
        price,
        status: 'request',
        location,
        desc,
        user_id: userId,
      });

      // purpose_tag_id를 배열로 만들어서 넣어준다.
      const purposeTagIds = purpose_tag_id.map((id) => {
        if (id !== null || id !== undefined) {
          return {
            workshop_id: workshop.identifiers[0].id,
            purpose_tag_id: id,
          };
        }
      });
      if (
        purposeTagIds[0].purpose_tag_id !== null ||
        purposeTagIds[0].purpose_tag_id !== undefined
      ) {
        await this.purposeTagIdRepository.insert(purposeTagIds);
      }

      // 썸네일 이미지와 서브 이미지들을 S3 에 저장한다.
      const workshopImageArray: Array<any> = [];
      images.forEach(async (image, index) => {
        // 첫 번째 image 일 경우 해당 이미지는 썸네일 이미지로 간주한다.
        if (index === 0) {
          const s3OptionForThumbImg = {
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3의 버킷 이름.
            Key: `images/workshops/${workshop.identifiers[0].id}/original/${thumbImgName}`, // 폴더 구조와 파일 이름 (실제로는 폴더 구조는 아님. 그냥 사용자가 인지하기 쉽게 폴더 혹은 주소마냥 나타내는 논리적 구조.)
            Body: image.buffer, // 업로드 하고자 하는 파일.
          };
          await this.s3Client.send(new PutObjectCommand(s3OptionForThumbImg)); // 실제로 S3 클라우드로 파일을 전송 및 업로드 하는 코드.
        } else {
          const subImgType = image.originalname.substring(
            image.originalname.lastIndexOf('.'),
            image.originalname.length,
          );
          const subImgName = uuid() + subImgType;
          workshopImageArray.push({
            workshop_id: workshop.identifiers[0].id,
            img_name: subImgName,
          });
          // 서브이미지 파일 경로
          const s3OptionForSubImg = {
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: `images/workshops/${workshop.identifiers[0].id}/original/${subImgName}`,
            Body: image.buffer,
          };
          await this.s3Client.send(new PutObjectCommand(s3OptionForSubImg));
        }
      });
      //
      if (workshopImageArray.length > 0) {
        await this.workshopImageRepository.insert(workshopImageArray);
      }
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
  async getTeacherIncompleteWorkshop(userId: number) {
    try {
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: userId },
        select: ['user_id', 'id'],
      });
      const userIds = userIdInfo.map((info) => info.id);
      console.log(userIds);
      if (userIdInfo.length === 0) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id ', {
            user_id: userId,
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
  async getTeacherComplete(userId: number) {
    try {
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: userId },
        select: ['user_id', 'id'],
      });
      if (userIdInfo.length === 0) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const workshopId = userIdInfo.map((info) => info.id); // id 값을 배열로 변환하여 workshopId 변수에 대입
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id ', {
            user_id: userId,
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
      throw error;
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
