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
import { In, Like, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateCompanyDto } from './dto/teacher-company.dto';
import { CreateTeacherDto } from './dto/teacher.dto';
import { CreateWorkshopsDto } from './dto/teacher-workshops.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { WorkShopImage } from 'src/entities/workshop-image';
import { identity } from 'rxjs';
import { wrap } from 'module';
import { QueryResult } from 'typeorm/query-runner/QueryResult';
import { TransformationType } from 'class-transformer';
import { CreateWorkshopsVideoDto } from './dto/teacher-workshops-video.dto';
import { UpdateWorkshopsDto } from './dto/teacher-workshop-update.dto';

@Injectable()
export class TeacherService {
  private readonly s3Client: S3Client;
  public readonly AWS_S3_BUCKET_NAME_IMAGE_INPUT: string;

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
    this.AWS_S3_BUCKET_NAME_IMAGE_INPUT = this.configService.get(
      'AWS_S3_BUCKET_NAME_IMAGE_INPUT',
    );
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
            'GROUP_CONCAT(purposeTag.name) as purposeTag_name', // GROUP_CONCAT을 써서 각 그룹의 purposeTag_name을를 하나의 행에 결합한다.
          ])
          .groupBy('workshop.id') // groupBy를 써서 각각 id에 해당하는 값을 나타낸다.
          .getRawMany();

        return result.map((workshop) => {
          return {
            ...workshop,
            workshop_thumb: `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN_IMAGE',
            )}images/workshops/${workshop.workshop_id}/800/${
              workshop.workshop_thumb
            }`,
          };
        });
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
      select: ['user_id', 'affiliation_company_id'],
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
      const results = await query.getMany();
      const teacher = results[0]; // results가 배열 형태이므로 배열을 없앤 값을 teacher에 넣어줬다.
      let company = { ...teacher.MyCompany };

      if (
        Object.keys(company).length === 0 &&
        userIdInfo.affiliation_company_id > 0
      ) {
        // 만약에 teacher.MyCompany가 없거나 userIdInfo.affiliation_company_id가 0보다 클경우 찾는다. 강사가 업체에 소속되어 있는 경우.
        company = await this.companyRepository.findOne({
          where: { id: userIdInfo.affiliation_company_id },
          select: ['company_name', 'saving_name', 'company_type'],
        });
      } else {
        company = null; // company가 있으면 위에 쿼리빌더로 나온 Mycompany랑 company값이 나와 총 두번 보여지므로 하나는 안보여지게 했다.
      }

      return {
        ...teacher,
        company,
      };
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
      return { message: '등록이 완료되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 등록된 업체 검색하기
  async searchCompanys(company_name: string) {
    try {
      const companys = await this.companyRepository.find({
        where: { company_name: Like(`%${company_name}%`), company_type: 0 },
        select: ['company_name', 'saving_name', 'user_id', 'createdAt'],
      });
      return companys;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 업체 목록 불러오기 API
  async gerAllCompanies() {
    try {
      const companies = await this.companyRepository.find({
        where: { company_type: 0 },
      });
      return companies;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 등록된 업체에 신청하기
  async registerTeacherCompany(userId: number, id: number) {
    try {
      const userIdInfo = await this.teacherRepository.findOne({
        where: { user_id: userId },
        select: ['user_id', 'affiliation_company_id'],
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록되지 않은 강사입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const companyApplyId = await this.companyApplicationRepository.findOne({
        where: { teacher_id: userId },
      });
      if (companyApplyId) {
        throw new HttpException(
          '이미 업체에 신청을 보냈습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const companyId = await this.companyRepository.findOne({
        where: { user_id: id },
        select: ['id'],
      });

      await this.companyApplicationRepository.insert({
        teacher_id: userId,
        company_id: companyId.id,
      });

      return { message: '해딩 업체에 신청되었습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 업체 소속을 신청한 업체 목록 보기
  async getApplyCompanys(userId: number) {
    try {
      const companyId = await this.companyRepository.findOne({
        where: { user_id: userId },
        select: ['id'],
      });
      if (!companyId) {
        throw new HttpException(
          '등록된 업체가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const Applycompanys = await this.companyApplicationRepository.find({
        where: { company_id: companyId.id },
        select: ['teacher_id'],
      });
      if (!Applycompanys) {
        throw new HttpException(
          '신청한 강사가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Promise.all()은 병렬로 여러 개의 비동기 작업을 수행하고 모든 작업이 완료될 때까지 기다린 다음 결과를 반환하는 데 사용된다.
      // find로 찾은 값이 배열이기 떄문에 각 배열요소에 병렬도 비동기 작업을 실행하고, 모든작업이 완료 될때까지 기다려야 하기 때문에 사용한다.
      // Promise.all() 메소드를 사용하여 모든 teacherRepository.findOne() 호출의 결과를 대기한다.
      const teachers = await Promise.all(
        Applycompanys.map((data) => {
          return this.teacherRepository.findOne({
            where: { user_id: data.teacher_id },
            select: ['name', 'user_id', 'phone_number'],
          });
        }),
      );
      return teachers;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 업체 소속을 신청한 업체 수락하기
  async registerCompany(userId: number, id: number) {
    try {
      const companyId = await this.companyRepository.findOne({
        where: { user_id: userId },
        select: ['id'],
      });
      if (!companyId) {
        throw new HttpException(
          '해당하는 업체가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const applycompanyId = await this.companyApplicationRepository.findOne({
        where: { teacher_id: id, company_id: companyId.id },
      });
      if (!applycompanyId) {
        throw new HttpException(
          '해당하는 강사가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const teahcerInfo = await this.teacherRepository.findOne({
        where: { user_id: id, affiliation_company_id: userId },
      });
      if (teahcerInfo) {
        throw new HttpException(
          '이미 해당하는 강사를 등록하였습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.teacherRepository.update(id, {
          affiliation_company_id: companyId.id,
        });

        await this.companyApplicationRepository.delete(applycompanyId.id);
      }

      return { message: '해딩 강사를 수락하였습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 업체 소속을 신청한 업체 등록 반려하기
  async cancleApplyCompany(userId: number, id: number) {
    try {
      const companyId = await this.companyRepository.findOne({
        where: { user_id: userId },
        select: ['id'],
      });
      if (!companyId) {
        throw new HttpException(
          '해당하는 업체가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const applycompanyId = await this.companyApplicationRepository.findOne({
        where: { teacher_id: id, company_id: companyId.id },
      });
      if (!applycompanyId) {
        throw new HttpException(
          '해당하는 강사가 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.companyApplicationRepository.delete(applycompanyId.id);
      }

      return { message: '해딩 강사를 반려 하였습니다.' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 워크샵 등록 신청 시 유효성 검사 우선시. 기본적인 타입 검사는 class-validator 가 수행.
  async checkWorkShopInFoValidation(workshopInputData: CreateWorkshopsDto) {
    const {
      title,
      category,
      min_member,
      max_member,
      genre_id,
      total_time,
      desc,
      price,
      location,
      purpose_tag_id,
    } = workshopInputData;

    if (purpose_tag_id.length < 1) {
      throw new HttpException(
        '워크샵의 목적 태그를 최소 한 개는 선택해야 합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 둘 다 null 이다 = 목적 태그가 1개도 입력되지 않았다.
    if (purpose_tag_id[0] === null && purpose_tag_id[1] === null) {
      throw new HttpException(
        '워크샵의 목적 태그를 최소 한 개는 선택해야 합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (purpose_tag_id[0] === purpose_tag_id[1]) {
      throw new HttpException(
        '동일한 목적을 선택하셨습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (min_member > max_member) {
      throw new HttpException(
        '최소 인원이 최대 인원을 초과하였습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 워크샵 등록 신청 하기
  async createTeacherWorkshops(
    data: CreateWorkshopsDto,
    images: Array<Express.Multer.File>,
    userId: number,
  ) {
    try {
      const {
        title,
        category,
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
        select: ['user_id', 'affiliation_company_id'],
      });
      if (!teacherInfo.user_id) {
        throw new HttpException(
          '등록된 강사가 아닙니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const companyInfo = await this.companyRepository.findOne({
        where: { user_id: userId },
      });
      if (teacherInfo.affiliation_company_id === 0 && !companyInfo) {
        throw new HttpException(
          '업체를 등록하셔야 워크샵을 등록 할 수 있습니다.',
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

      // 온라인 / 오프라인 카테고리 유형 정하기
      type WorkshopCategoryType = 'offline' | 'online';
      const workshopCategory = category as WorkshopCategoryType;

      const workshop = await this.workshopRepository.insert({
        thumb: thumbImgName,
        category: workshopCategory,
        title,
        min_member,
        max_member,
        genre_id,
        total_time,
        price,
        status: 'approval', // 유저 테스트 종료 시 'request' 로 변환해야 함.
        location,
        desc,
        user_id: userId,
      });

      // purpose_tag_id를 배열로 만들어서 넣어준다.
      let purposeTagIds: Array<object> = [];
      purpose_tag_id.forEach((tagId) => {
        if (typeof tagId === 'number') {
          purposeTagIds.push({
            workshop_id: workshop.identifiers[0].id,
            purpose_tag_id: tagId,
          });
        }
      });
      if (purposeTagIds.length > 0) {
        await this.purposeTagIdRepository.insert(purposeTagIds);
      }

      // 썸네일 이미지와 서브 이미지들을 S3 에 저장한다.
      const workshopImageArray: Array<any> = [];
      images.forEach(async (image, index) => {
        // 첫 번째 image 일 경우 해당 이미지는 썸네일 이미지로 간주한다.
        if (index === 0) {
          const s3OptionForThumbImg = {
            Bucket: this.AWS_S3_BUCKET_NAME_IMAGE_INPUT, // S3의 버킷 이름.
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
            Bucket: this.AWS_S3_BUCKET_NAME_IMAGE_INPUT,
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
        workshop_id: workshop.identifiers[0].id,
        title,
      };
    } catch (error) {
      throw error;
    }
  }

  // 워크샵 등록 후 영상 등록
  async uploadVideo(
    workshopData: CreateWorkshopsVideoDto,
    video: Express.Multer.File,
    userId: number,
  ) {
    // 비디오를 추가하려는 워크샵이 만들어져 있는지, video 는 null 상태인지 체크
    const workshop = await this.workshopRepository.findOne({
      where: {
        id: workshopData.workshop_id,
        title: workshopData.title,
        user_id: userId,
      },
    });
    if (!workshop) {
      throw new BadRequestException(
        '워크샵을 등록하는 과정에서 오류가 발생하였습니다.',
      );
    }
    if (workshop.video !== null) {
      throw new BadRequestException(
        '해당 워크샵에는 동영상이 이미 등록되어 있습니다.',
      );
    }

    // 정상적으로 비디오 업로딩이 진행되는 경우 --------------------
    try {
      // 랜덤한 이름 생성
      const videoTypeName = video.originalname.substring(
        video.originalname.lastIndexOf('.'),
        video.originalname.length,
      );
      const videoName = uuid() + videoTypeName;

      // s3 에 입력할 옵션
      const s3OptionForReviewVideo = {
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME_VIDEO_INPUT'),
        Key: `videos/workshops/${workshopData.workshop_id}/original/${videoName}`,
        Body: video.buffer,
      };

      // 실제로 s3 버킷에 업로드
      await this.s3Client.send(new PutObjectCommand(s3OptionForReviewVideo));

      // 워크샵의 video 도 이름을 적어준다
      await this.workshopRepository.update(
        {
          id: workshopData.workshop_id,
          title: workshopData.title,
          user_id: userId,
        },
        {
          video: videoName,
        },
      );

      return;
    } catch (err) {
      throw err;
    }
  }
  // 워크샵 상세 보기 api
  async workshopDetail(userId: number, id: number) {
    try {
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: userId },
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        let result = await this.workshopRepository
          .createQueryBuilder('workshop')
          .where('workshop.user_id = :user_id', { user_id: userId })
          .andWhere('workshop.id = :id', { id: id })
          .innerJoinAndSelect('workshop.GenreTag', 'genreTag')
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .leftJoinAndSelect('workshop.Images', 'workshopImage')
          .select([
            'workshop.id',
            'workshop.title',
            'workshop.category',
            'workshop.desc',
            'workshop.thumb',
            'workshop.min_member',
            'workshop.max_member',
            'workshop.total_time',
            'workshop.price',
            'workshop.location',
            'workshop.video',
            'workshop.createdAt',
            'genreTag.name',
            'GROUP_CONCAT(DISTINCT workshopImage.img_name) as img_name',
            'GROUP_CONCAT(DISTINCT purposeTag.name) as purposeTag_name', // GROUP_CONCAT을 써서 각 그룹의 purposeTag_name을를 하나의 행에 결합한다.
          ])
          .getRawMany();

        return result.map((workshop) => {
          // 서브 이미지들 목록을 string[] 으로 만들어주기
          let subImageUrlArray: string[] = [];

          if (workshop.img_name !== null) {
            const subImageArray: string[] = workshop.img_name.split(',');
            subImageArray.forEach((subImageName) => {
              subImageUrlArray.push(`
                ${this.configService.get(
                  'AWS_CLOUD_FRONT_DOMAIN_IMAGE',
                )}images/workshops/${workshop.workshop_id}/800/${subImageName}
              `);
            });
          }

          // 비디오 URL 완성시키기
          let workshopVedioUrl: string = ``;
          if (workshop.workshop_video !== null) {
            const videoNameWithOutType = workshop.workshop_video.substring(
              0,
              workshop.workshop_video.lastIndexOf('.'),
            );
            workshopVedioUrl = `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN_VIDEO',
            )}videos/workshops/${
              workshop.workshop_id
            }/hls/${videoNameWithOutType}.m3u8`;
          }

          return {
            ...workshop,
            workshop_thumb: `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN_IMAGE',
            )}images/workshops/${workshop.workshop_id}/800/${
              workshop.workshop_thumb
            }`,
            workshop_videoUrl: workshopVedioUrl,
            subImageUrlArray,
          };
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 강사 미완료 워크샵 목록 api
  async getTeacherIncompleteWorkshop(userId: number) {
    try {
      // find로 찾으면 배열안에 객체형태로 [ WorkShop { id: 31, user_id: 11 }, WorkShop { id: 32, user_id: 11 } ] 나타난다.
      const userIdInfo = await this.workshopRepository.find({
        where: { user_id: userId },
        select: ['user_id', 'id'],
      });
      // id만 map으로 새로운 배열형태를 만든다. [31,32]
      const userIds = userIdInfo.map((info) => info.id);
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
          // IN : 하나라도 값이 들어가 있으면 그에 해당하는 값을 가져온다.
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
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .select([
            'workshop.id',
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
            'GROUP_CONCAT(purposeTag.name) as purposeTag_name', // GROUP_CONCAT을 써서 각 그룹의 purposeTag_name을를 하나의 행에 결합한다.
          ])
          .groupBy('workShopInstanceDetail.id') // groupBy를 써서 각각 id에 해당하는 값을 나타낸다.
          .getRawMany();

        return result.map((workshop) => {
          return {
            ...workshop,
            workshop_thumb: `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN_IMAGE',
            )}images/workshops/${workshop.workshop_id}/800/${
              workshop.workshop_thumb
            }`,
          };
        });
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
        const workshopId = userIdInfo.map((info) => info.id); // id 값을 배열로 변환한다.
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
          .innerJoinAndSelect('workshop.PurposeList', 'workshopPurpose')
          .innerJoinAndSelect('workshopPurpose.PurPoseTag', 'purposeTag')
          .select([
            'workshop.id',
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
            'GROUP_CONCAT(purposeTag.name) as purposeTag_name', // GROUP_CONCAT을 써서 각 그룹의 purposeTag_name을를 하나의 행에 결합한다.
          ])
          .groupBy('workShopInstanceDetail.id') // groupBy를 써서 각각 id에 해당하는 값을 나타낸다.
          .getRawMany();

        const sendingResult = result.map((myWorkShopAndDetail) => {
          return {
            ...myWorkShopAndDetail,
            workshopThumbUrl: `${this.configService.get(
              'AWS_CLOUD_FRONT_DOMAIN_IMAGE',
            )}images/workshops/${myWorkShopAndDetail.workshop_id}/800/${
              myWorkShopAndDetail.workshop_thumb
            }`,
          };
        });
        return sendingResult;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 강사 수강 문의 수락하기 api
  async updateTeacherAccept(userId: number, id: number) {
    try {
      const userIdInfo = await this.workshopRepository.findOne({
        where: { user_id: userId },
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
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
  async updateTeacherComplete(userId: number, id: number) {
    try {
      const userIdInfo = await this.workshopRepository.findOne({
        where: { user_id: userId },
      });
      if (!userIdInfo) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
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

  // 강사 수강 문의 반려하기
  async cancleWorkshop(userId: number, id: number) {
    try {
      const workshopId = await this.workshopRepository.findOne({
        where: { user_id: userId },
      });

      if (!workshopId) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const workShopInstance =
        await this.workShopInstanceDetailRepository.findOne({
          where: { id },
        });
      if (
        workShopInstance.status === 'request' ||
        workShopInstance.status === 'non_payment'
      ) {
        await this.workShopInstanceDetailRepository.update(
          { id },
          { status: 'rejected' },
        );
      }

      return {
        message: '해당 워크샵을 반려하였습니다.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // 워크샵 수정
  async updateWorkshop(data: UpdateWorkshopsDto, userId: number, id: number) {
    try {
      const {
        title,
        category,
        desc,
        min_member,
        max_member,
        total_time,
        price,
        location,
        genre_id,
        purpose_tag_id,
      } = data;
      const workshopId = await this.workshopRepository.findOne({
        where: { user_id: userId },
      });
      if (!workshopId) {
        throw new HttpException(
          '등록된 워크샵이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      type WorkshopCategoryType = 'offline' | 'online';
      const workshopCategory = category as WorkshopCategoryType;
      const workshop = await this.workshopRepository.update(id, {
        title,
        category: workshopCategory,
        desc,
        min_member,
        max_member,
        total_time,
        price,
        location,
        genre_id,
      });
      const updatedWorkshop = await this.workshopRepository.findOne({
        where: { id },
      });
      let purposeTagIds: Array<object> = [];
      purpose_tag_id.forEach((tagId) => {
        if (typeof tagId === 'number') {
          purposeTagIds.push({
            workshop_id: updatedWorkshop.id,
            purpose_tag_id: tagId,
          });
        }
      });
      if (purposeTagIds.length > 0) {
        await this.purposeTagIdRepository.delete({
          workshop_id: updatedWorkshop.id,
        });
        await this.purposeTagIdRepository.save(purposeTagIds);
      }
      return {
        message: '해당 워크샵을 수정하였습니다.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // 워크샵 삭제
}
