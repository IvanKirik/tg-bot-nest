import { Module } from '@nestjs/common';
import { OpenAiModule } from './open-ai/open-ai.module';
import { ConverterModule } from './converter/converter.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TelegramModule } from "./telegram/telegram.module";
import { TelegrafModule } from "nestjs-telegraf";
import { getTelegramConfig } from "./config/telegram.config";
import { getOpenAiConfig } from "./config/openAi.config";
import { TelegramService } from "./telegram/telegram.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule, TelegramModule],
      useFactory: getTelegramConfig,
      inject: [ConfigService],
    }),
    ConverterModule,
    TelegramModule
  ]
})
export class AppModule {}
