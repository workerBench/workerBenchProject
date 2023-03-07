import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkShop } from 'src/entities/workshop';
import { AdminControllerRender } from './admin-render.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkShop])],
  controllers: [AdminController, AdminControllerRender],
  providers: [AdminService]
})
export class AdminModule {}
