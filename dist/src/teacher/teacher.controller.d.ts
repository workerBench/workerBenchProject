import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
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
    getTeacherMypage(): Promise<import("../entities/teacher").Teacher[]>;
    createTeacherCompany(data: createCompanyDto): Promise<{
        message: string;
    }>;
    createTeacherWorkshops(data: createWorkshopsDto): Promise<{
        message: string;
    }>;
    getTeacherRequest(): Promise<import("../entities/workshop").WorkShop[]>;
    getTeacherComplete(): Promise<import("../entities/workshop").WorkShop[]>;
    updateTeacherAccept(id: number): Promise<{
        message: string;
    }>;
    updateTeacherComplete(id: number): Promise<{
        message: string;
    }>;
}
