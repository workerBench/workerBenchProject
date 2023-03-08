import { Company } from 'src/entities/company';
import { Teacher } from 'src/entities/teacher';
import { User } from 'src/entities/user';
import { WorkShop } from 'src/entities/workshop';
import { Repository } from 'typeorm';
import { CompanyRepository } from './teacher.repository';
export declare class TeacherService {
    private teacherRepository;
    private userRepository;
    private workshopRepository;
    private companyRepository;
    constructor(teacherRepository: Repository<Teacher>, userRepository: Repository<User>, workshopRepository: Repository<WorkShop>, companyRepository: CompanyRepository);
    createTeacherRegister(user_id: number, phone_number: string, address: string, name: string): Promise<{
        errorMessage: string;
        message?: undefined;
    } | {
        message: string;
        errorMessage?: undefined;
    }>;
    getTeacherWorkshops(): Promise<WorkShop[]>;
    getTeacherMypage(user_id: number): Promise<Company[]>;
    createTeacherCompany(company_type: number, company_name: string, business_number: number, rrn_front: number, rrn_back: number, bank_name: string, account: number, saving_name: string, isBan: number, user_id: number): Promise<{
        message: string;
    }>;
    createTeacherWorkshops(category: 'online' | 'offline', genre_id: number, title: string, desc: string, thumb: string, min_member: number, max_member: number, total_time: number, price: number, location: string): Promise<{
        message: string;
    }>;
    getTeacherRequest(): Promise<WorkShop[]>;
    getTeacherComplete(): Promise<WorkShop[]>;
    updateTeacherAccept(id: number): Promise<{
        message: string;
    }>;
    updateTeacherComplete(id: number): Promise<{
        message: string;
    }>;
}
