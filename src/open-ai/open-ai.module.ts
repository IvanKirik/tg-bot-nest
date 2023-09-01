import { DynamicModule, Module, Provider } from "@nestjs/common";
import { OpenAiService } from './open-ai.service';
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { OPEN_AI_OPTIONS, OPEN_AI_SERVICE } from "./openAi.constants";
import { IOpenAiModuleAsyncOptions } from "./openAi.interface";

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ]
})

export class OpenAiModule {
  public static forRootAsync(options: IOpenAiModuleAsyncOptions): DynamicModule {
    const asyncOptions = this.createAsyncOptionsProvider(options);
    return {
      module: OpenAiModule,
      imports: options.imports,
      providers: [
        {
          provide: OPEN_AI_SERVICE,
          useClass: OpenAiService,
        },
        asyncOptions
      ],
      exports: [OPEN_AI_SERVICE]
    }
  }

  private static createAsyncOptionsProvider(options: IOpenAiModuleAsyncOptions): Provider {
    return {
      provide: OPEN_AI_OPTIONS,
      useFactory: async (...args: any[]) => {
        return options.useFactory(...args);
      },
      inject: options.inject || []
    }
  }
}
