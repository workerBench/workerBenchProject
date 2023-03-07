import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { Teacher } from 'src/entities/teacher';
import { createCompanyDto } from './dto/CreateCompanyDto';
import { createTeacherDto } from './dto/createTeacherDto';
import { createWorkshopsDto } from './dto/createWorkshopsDto';
import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    createTeacherRegister(data: createTeacherDto, user: CurrentUserDto): Promise<{
        message: string;
    }>;
    getTeacherWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    getTeacherMypage(): Promise<Teacher[]>;
    createTeacherCompany(data: createCompanyDto): Promise<{
        message: string;
    }>;
    createTeacherWorkshops(data: createWorkshopsDto): Promise<{
        message: string;
    }>;
    getTeacherRequest(): void;
    getTeacherComplete(): void;
}
