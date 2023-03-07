"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const workshop_1 = require("./src/entities/workshop");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [workshop_1.WorkShop],
    migrations: [__dirname + '/src/migrations/*.ts'],
    charset: 'utf8mb4_general_ci',
    synchronize: false,
    logging: true,
});
exports.default = dataSource;
//# sourceMappingURL=dataSource.js.map