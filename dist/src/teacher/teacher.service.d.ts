import { Company } from 'src/entities/company';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';
export declare class TeacherService {
    private teacherRepository;
    private userRepository;
    private companyRepository;
    private workshopRepository;
    constructor(teacherRepository: Repository<Teacher>, userRepository: Repository<User>, companyRepository: Repository<Company>, workshopRepository: Repository<WorkShop>);
    createTeacherRegister(phone_number: string, address: string, name: string): Promise<{
        errorMessage: string;
        message?: undefined;
    } | {
        message: string;
        errorMessage?: undefined;
    }>;
    getTeacherWorkshops(): Promise<WorkShop[]>;
    getTeacherMypage(): Promise<Teacher[]>;
    createTeacherCompany(company_type: number, company_name: string, business_number: number, rrn_front: number, rrn_back: number, bank_name: string, account: number, saving_name: string, isBan: number, user_id: number): Promise<{
        message: string;
        errorMessage?: undefined;
    } | {
        errorMessage: string;
        message?: undefined;
    }>;
    createTeacherWorkshops(title: string, category: string, desc: string, thumb: string, min_member: number, max_member: number, total_time: number, price: number, status: string, location: string): void;
    getTeacherRequest(): void;
    getTeacherComplete(): void;
    updateTeacherAccept(): void;
    updateTeacherComplete(): void;
}
