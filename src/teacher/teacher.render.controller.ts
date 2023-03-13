import { Controller, Get, Render } from '@nestjs/common';
@Controller('teacher')
export class TeacherControllerRender {
  @Get('/manage/incomplete')
  @Render('teacher/teacher-manage-incomplete')
  q() {}
  @Get('/register')
  @Render('teacher/teacher-register')
  b() {}
  @Get('/workshop/information')
  @Render('teacher/teacher-workshop-information')
  c() {}
  @Get('/workshop')
  @Render('teacher/teacher-workshop')
  d() {}
  @Get('/workshop/register')
  @Render('teacher/workshop-register')
  e() {}
  @Get('/company/register')
  @Render('teacher/company-register')
  f() {}
  @Get('/manage/complete')
  @Render('teacher/teacher-manage-complete')
  a() {}
}
