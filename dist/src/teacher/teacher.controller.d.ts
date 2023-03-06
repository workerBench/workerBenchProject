import { createCompanyDto } from './dto/CreateCompanyDto';
import { createTeacherDto } from './dto/createTeacherDto';
import { createWorkshopsDto } from './dto/createWorkshopsDto';
import { TeacherService } from './teacher.service';
export declare class TeacherController {
    private readonly teacherService;
    constructor(teacherService: TeacherService);
    createTeacherRegister(data: createTeacherDto): Promise<{
        message: string;
        errorMessage?: undefined;
    } | {
        errorMessage: string;
        message?: undefined;
    }>;
    getTeacherWorkshops(): Promise<void>;
    getTeacherMypage(): Promise<void>;
    createTeacherCompany(data: createCompanyDto): Promise<{
        errorMessage: string;
        message?: undefined;
    } | {
        message: string;
        errorMessage?: undefined;
    }>;
    createTeacherWorkshops(data: createWorkshopsDto): void;
    getTeacherRequest(): void;
    getTeacherComplete(): void;
}
