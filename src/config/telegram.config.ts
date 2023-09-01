import { ConfigService } from "@nestjs/config";
import { TelegrafModuleOptions } from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local'

const session = new LocalSession({database: 'session_db.json'});

export const getTelegramConfig = async (configService: ConfigService): Promise<TelegrafModuleOptions> => {
  const token = await configService.get('TELEGRAM_TOKEN');
  if (!token) {
    throw new Error('TELEGRAM_TOKEN не задан!')
  }
  return {
    token,
    middlewares: [session.middleware()]
  }
}
