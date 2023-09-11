import { Module } from '@nestjs/common';
import { ConverterModule } from './converter/converter.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegramModule } from "./telegram/telegram.module";
import { TelegrafModule } from "nestjs-telegraf";
import { getTelegramConfig } from "./config/telegram.config";
import { SequelizeModule } from "@nestjs/sequelize";
import { getConfigPostgres } from "./config/postgres.config";
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule, TelegramModule],
      useFactory: getTelegramConfig,
      inject: [ConfigService]
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getConfigPostgres,
      inject: [ConfigService]
    }),
    TelegramModule,
    UsersModule
  ]
})
export class AppModule {}
