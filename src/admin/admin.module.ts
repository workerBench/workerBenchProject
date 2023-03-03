import { Module } from '@nestjs/common';

import { AdminControllerRender } from './admin-render.controller';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController, AdminControllerRender],
  providers: [AdminService]
})
export class AdminModule {}
