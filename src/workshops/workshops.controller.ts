import { Controller, Get, Param, Render } from '@nestjs/common';

@Controller('workshops')
export class WorkshopsController { 
    @Get() 
    getAll() {
        return 'here is workshops';
    }

    @Get("/:id")
    getOne(@Param('id') workshopsId: string) {
        return `return one workshops id : ${workshopsId}`;
    }
}