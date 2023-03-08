import { Module } from '@nestjs/common';
import { TeacherControllerRender } from './teacher.render.controller';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { Company } from 'src/entities/company';
import { WorkShop } from 'src/entities/workshop';
import { CompanyRepository } from './teacher.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
        [Teacher,User,Company,WorkShop]
    )
],
  controllers: [TeacherController, TeacherControllerRender],
  providers: [TeacherService,CompanyRepository]
})
export class TeacherModule {}
