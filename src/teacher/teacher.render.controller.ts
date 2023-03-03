import { Controller,Get,Render } from '@nestjs/common';
@Controller()
export class TeacherControllerRender {
  @Get('/teacher/manage/incomplete')
  @Render('teacher/teacher-manage-incomplete')
  q() {
  }
  @Get('/teacher/register')
  @Render('teacher/teacher-register')
  b() {
  }
  @Get('/teacher/workshop/information')
  @Render('teacher/teacher-workshop-information')
  c() {
  }
  @Get('/teacher/workshop')
  @Render('teacher/teacher-workshop')
  d() {
  }
  @Get('/workshop/register')
  @Render('teacher/workshop-register')
  e() {
  }
  @Get('/company/register')
  @Render('teacher/company-register')
  f() {
  }
  @Get('/teacher/manage/complete')
  @Render('teacher/teacher-manage-complete')
  a() {
  }
}