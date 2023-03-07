import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WorkshopsService } from 'src/workshops/workshops.service';

@Controller('/api/workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}


}
