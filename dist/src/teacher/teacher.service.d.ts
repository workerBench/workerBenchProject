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
    createTeacherRegister(id: number, phone_number: string, address: string, name: string): Promise<{
        message: string;
    }>;
    getTeacherWorkshops(): Promise<WorkShop[]>;
    getTeacherMypage(): Promise<Teacher[]>;
    createTeacherCompany(company_type: number, company_name: string, business_number: number, rrn_front: number, rrn_back: number, bank_name: string, account: number, saving_name: string, isBan: number, user_id: number): {
        message: string;
    };
    createTeacherWorkshops(category: string, genre_id: number, title: string, desc: string, thumb: string, min_member: number, max_member: number, total_time: number, price: number, status: string, location: string): {
        message: string;
    };
    getTeacherRequest(id: number): Promise<WorkShop>;
    getTeacherComplete(): Promise<WorkShop[]>;
    updateTeacherAccept(id: number): Promise<{
        message: string;
    }>;
    updateTeacherComplete(id: number): Promise<{
        message: string;
    }>;
}
