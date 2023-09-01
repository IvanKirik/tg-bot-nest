import { ConfigService } from "@nestjs/config";
import { IOpenAiOptionsInterface } from "../open-ai/openAi.interface";

export const getOpenAiConfig = (configService: ConfigService): IOpenAiOptionsInterface => {
  const apiKey = configService.get('OPENAI_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_KEY не задан!')
  }
  return  {
    apiKey
  }
}
