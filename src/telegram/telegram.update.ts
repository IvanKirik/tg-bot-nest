import { Ctx, Hears, InjectBot, On, Start, Update } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { GPT3, GPT4, OPEN_AI_SERVICE } from "../open-ai/openAi.constants";
import { OpenAiService } from "../open-ai/open-ai.service";
import { Inject } from "@nestjs/common";
import { ChatModel } from "../type/chatModel.type";
import { RolesType } from "../type/roles.type";
import { code } from "telegraf/format";

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    @Inject(OPEN_AI_SERVICE) private readonly openAiService: OpenAiService
    ) {
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Выберите модель чата', Markup.keyboard([
      Markup.button.callback(GPT3, GPT3),
      Markup.button.callback(GPT4, GPT4)
    ],
      {
        columns: 2,
      }
      ).resize()
    )
  }

  @Hears(ChatModel.GPT3)
  async createChat3(ctx: Context) {
    this.openAiService.chatModel = ChatModel.GPT3;
    this.openAiService.setSessions = {role: RolesType.USER, content: ChatModel.GPT3}
    // await ctx.editMessageText('Жду от вас голосового или текстового сообщения');
  }

  @Hears(ChatModel.GPT4)
  async createChat4(ctx: Context) {
    this.openAiService.chatModel = ChatModel.GPT4;
    this.openAiService.setSessions = {role: RolesType.USER, content: ChatModel.GPT4}
    // await ctx.editMessageText('Жду от вас голосового или текстового сообщения');
  }

  @On('text')
  async getMessage(@Ctx() ctx: Context<any>) {
    try {
      await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));

      this.openAiService.setSessions = {role: RolesType.USER, content: ctx.update.message.text}

      if (ctx.update.message.text!.match(/#img|Сгенерируй изображение/i)) {
        const response = await this.openAiService.imageCreate(ctx.update.message.text);
        if (response) {
          this.openAiService.setSessions = {role: RolesType.ASSISTANT, content: response}
          await ctx.reply(response);
        }
      } else {
        const response = await this.openAiService.chat(this.openAiService.getSessions);
        if (response && response.content) {
          this.openAiService.setSessions = {role: RolesType.ASSISTANT, content: response.content}
          await ctx.reply(response.content);
        }
      }

    } catch (e: any) {
      console.log(`Error while text message ${e.message}`)
    }
  }
}
