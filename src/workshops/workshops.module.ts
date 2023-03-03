import { Module } from '@nestjs/common';
import {
  WorkshopsController,
  WorkshopsControllerRender,
} from './workshops.controller';
import { WorkshopsService } from './workshops.service';

@Module({
  controllers: [WorkshopsController, WorkshopsControllerRender],
  providers: [WorkshopsService],
})
export class WorkshopsModule {}
