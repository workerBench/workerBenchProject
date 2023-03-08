import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { AdminControllerRender } from './admin-render.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkShop, User, Company])],
  controllers: [AdminController, AdminControllerRender],
  providers: [AdminService]
})
export class AdminModule {}
