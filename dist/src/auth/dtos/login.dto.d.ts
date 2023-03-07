import { User } from 'src/entities/user';
declare const LoginDto_base: import("@nestjs/common").Type<Pick<User, "password" | "email">>;
export declare class LoginDto extends LoginDto_base {
}
export {};
