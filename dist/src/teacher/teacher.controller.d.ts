import { createCompanyDto } from './dto/CreateCompanyDto';
import { createTeacherDto } from './dto/createTeacherDto';
import { createWorkshopsDto } from './dto/createWorkshopsDto';
import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    createTeacherRegister(data: createTeacherDto): Promise<{
        message: string;
    }>;
    getTeacherWorkshops(): Promise<import("../entities/workshop").WorkShop[]>;
    getTeacherMypage(): Promise<import("../entities/teacher").Teacher[]>;
    createTeacherCompany(data: createCompanyDto): Promise<{
        message: string;
    }>;
    createTeacherWorkshops(data: createWorkshopsDto): void;
    getTeacherRequest(): void;
    getTeacherComplete(): void;
}
