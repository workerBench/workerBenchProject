import { Module } from '@nestjs/common';
import { TeacherControllerRender } from './teacher.render.controller';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  controllers: [TeacherController, TeacherControllerRender],
  providers: [TeacherService]
})
export class TeacherModule {}
