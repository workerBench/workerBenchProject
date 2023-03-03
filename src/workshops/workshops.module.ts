import { Module } from '@nestjs/common';
import { WorkshopsController } from './workshops.controller';
import { WorkshopsControllerRender } from './workshops.controller-render';
import { WorkshopsService } from './workshops.service';

@Module({
  controllers: [WorkshopsController, WorkshopsControllerRender],
  providers: [WorkshopsService],
})
export class WorkshopsModule {}
