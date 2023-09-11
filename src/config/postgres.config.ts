import {ConfigService} from "@nestjs/config";
import {SequelizeModuleOptions} from "@nestjs/sequelize/dist/interfaces/sequelize-options.interface";
import { User } from "../users/user.model";

export const getConfigPostgres = async (configService: ConfigService): Promise<SequelizeModuleOptions> => {
  return {
    dialect: 'postgres',
    host: await configService.get('DB_HOST'),
    port: await configService.get('DB_PORT'),
    username: await configService.get('DB_USERNAME'),
    password: await configService.get('DB_PASSWORD'),
    database: await configService.get('DB_NAME'),
    models: [User],
    autoLoadModels: true,
    synchronize: true
  }
}
