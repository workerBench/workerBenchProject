"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const user_1 = require("../entities/user");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const redis_key_name_1 = require("./naming/redis-key-name");
const user_type_1 = require("./naming/user-type");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, configService, mailerService, redisService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailerService = mailerService;
        this.redisService = redisService;
        this.redisClient = redisService.getClient();
    }
    async checkEffective(userInfo) {
        const { email, password, authentNum } = userInfo;
        if (!email || !email.includes('@') || !email.includes('.')) {
            const err = new Error('이메일 형식이 올바르지 않습니다.');
            err.name = 'WrongEmailError';
            throw err;
        }
        if (password !== authentNum) {
            const err = new Error('패스워드가 일치하지 않습니다.');
            err.name = 'WrongPasswordError';
            throw err;
        }
        if (password.length < 4) {
            const err = new Error('패스워드가 짧습니다.');
            err.name = 'WrongPasswordError';
            throw err;
        }
    }
    async checkingAccount(email) {
        const check_email = await this.userRepository.findOne({ where: { email } });
        if (check_email) {
            const err = new Error('이미 존재하는 이메일 입니다.');
            err.name = 'DuplicationEmailError';
            throw err;
        }
    }
    async sendingEmailAuthCode(email) {
        const auth_num = (0, crypto_1.randomBytes)(3).toString('hex');
        await this.redisClient.setex((0, redis_key_name_1.emailAuthCodeRedisKey)(email), 300, auth_num);
        this.mailerService
            .sendMail({
            to: email,
            from: this.configService.get('GOOGLE_MAIL'),
            subject: 'workshop 회원가입 이메일 인증',
            html: `<h1>인증번호 : ${auth_num}</h1>`,
        })
            .then((result) => {
            console.log(result);
        })
            .catch((error) => {
            console.log(error);
            throw new common_1.ConflictException();
        });
        return true;
    }
    async checkingEmailCode(email, emailAuthCode) {
        const authCodeOfRedis = await this.redisClient.get((0, redis_key_name_1.emailAuthCodeRedisKey)(email));
        if (authCodeOfRedis !== emailAuthCode) {
            const err = new Error('입력하신 인증번호가 적합하지 않습니다.');
            err.name = 'WrongEmailAuthCode';
            throw err;
        }
        return;
    }
    async joinUser(email, password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const saveResult = await this.userRepository.save({
            email,
            password: hashedPassword,
        });
        return saveResult;
    }
    async makeAccessToken(id, email, userType) {
        const accessToekn = await this.jwtService.signAsync({ id, email, userType }, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: '60s',
            algorithm: 'HS256',
        });
        return accessToekn;
    }
    async makeRefreshToken(id, email, userType, clientIp) {
        let userTypeString;
        if (userType === 0) {
            userTypeString = user_type_1.userTypeNaming.user;
        }
        if (userType === 1) {
            userTypeString = user_type_1.userTypeNaming.teacher;
        }
        const refreshToekn = await this.jwtService.signAsync({ id, email, userType }, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: '100s',
            algorithm: 'HS256',
        });
        await this.redisClient.setex((0, redis_key_name_1.refreshTokenRedisKey)(userTypeString, id), 100, `${clientIp}_${refreshToekn}`);
        return refreshToekn;
    }
    async checkLoginUser(email, password) {
        const userInfo = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'user_type'],
        });
        if (!userInfo) {
            const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
            err.name = 'DoesntExistEmailOrPasswordError';
            throw err;
        }
        if (!(await bcrypt.compare(password, userInfo.password))) {
            const err = new Error('이메일 또는 비밀번호가 일치하지 않습니다');
            err.name = 'DoesntExistEmailOrPasswordError';
            throw err;
        }
        return userInfo;
    }
    async checkUserFromUserAccessToken(id, email, userType) {
        const userInfo = await this.userRepository.findOne({
            where: { id, email, user_type: userType },
            select: ['id', 'email', 'user_type', 'isBan'],
        });
        return userInfo;
    }
    async checkRefreshTokenInRedis(id, userType, ip, refreshToken) {
        let userTypeString;
        if (userType === 0) {
            userTypeString = user_type_1.userTypeNaming.user;
        }
        if (userType === 1) {
            userTypeString = user_type_1.userTypeNaming.teacher;
        }
        const clientInfoFromRedis = (await this.redisClient.get((0, redis_key_name_1.refreshTokenRedisKey)(userTypeString, id))).split('_');
        if (clientInfoFromRedis[0] !== ip) {
            const err = new Error('사용자의 ip 정보가 정확하지 않습니다');
            err.name = 'IpDoesntSame';
            throw err;
        }
        if (clientInfoFromRedis[1] !== refreshToken) {
            const err = new Error('사용자의 토큰 정보가 정확하지 않습니다');
            err.name = 'IpDoesntSame';
            throw err;
        }
        return;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        mailer_1.MailerService,
        nestjs_redis_1.RedisService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map