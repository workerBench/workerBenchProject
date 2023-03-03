import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: false,
  logging: true,
});

export default dataSource;
