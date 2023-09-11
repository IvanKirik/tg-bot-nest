import { Module} from "@nestjs/common";
import { TelegramUpdate } from "./telegram.update";
import { TelegramService } from "./telegram.service";
import { OpenAiModule } from "../open-ai/open-ai.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getOpenAiConfig } from "../config/openAi.config";
import { UsersModule } from "../users/users.module";
import { ConverterModule } from "../converter/converter.module";


@Module({
  imports: [
    ConfigModule,
    OpenAiModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getOpenAiConfig,
      inject: [ConfigService]
    }),
    UsersModule,
    ConverterModule
  ],
  providers: [
    TelegramUpdate,
    TelegramService
  ],
})
export class TelegramModule { }

