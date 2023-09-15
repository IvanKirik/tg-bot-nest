import {Command, Ctx, Hears, InjectBot, On, Start, Update} from "nestjs-telegraf";
import {CODEX, GPT3, GPT4, OPEN_AI_SERVICE} from "../open-ai/openAi.constants";
import {OpenAiService} from "../open-ai/open-ai.service";
import {Inject} from "@nestjs/common";
import {RolesType} from "../type/roles.type";
import {code} from "telegraf/format";
import {UserName} from "../decorators/userName.decorator";
import {UsersService} from "../users/users.service";
import {NEW_USER_SCENES} from "./telegram.constants";
import {ConverterService} from "../converter/converter.service";
import {Context, Telegraf} from "telegraf";
import {IContext} from "../interfaces/context.interafce";

@Update()
export class TelegramUpdate {
    constructor(
        @InjectBot() private readonly bot: Telegraf<IContext>,
        @Inject(OPEN_AI_SERVICE) private readonly openAiService: OpenAiService,
        private readonly userService: UsersService,
        private readonly converterService: ConverterService
    ) {
    }

    @Start()
    async startCommand(@Ctx() ctx: IContext, @UserName() userName: string) {
        try {
            const user = await this.userService.findOne(userName);
            if (!user) {
                await ctx.reply(code('Вы не зарегистрированы в системе!'));
                return;
            }
            await ctx.reply(code('Жду от вас голосового или текстового сообщения!'));
        } catch (e) {
            await ctx.reply(code('Вы не зарегистрированы в системе!'));
        }
    }

    @Command('newuser')
    async addNewUser(@Ctx() ctx: IContext, @UserName() userName: string) {
        await ctx.scene.enter(NEW_USER_SCENES);
    }

    @Command('gpt3')
    async onGPT3(@Ctx() ctx: IContext, @UserName() userName: string) {
        try {
            const user = await this.userService.findOne(userName);
            if (!user) {
                await ctx.reply(code('Вы не зарегистрированы в системе!'));
                return;
            }
            this.openAiService.chatModel = GPT3;
            await ctx.deleteMessage();
            await ctx.reply(code(`Модель чата переключена на ${GPT3}`))
        } catch (e) {
            await ctx.reply(code('Вы не зарегистрированы в системе!'));
        }
    }

    @Command('gpt4')
    async onGPT4(@Ctx() ctx: IContext, @UserName() userName: string) {
        try {
            const user = await this.userService.findOne(userName);
            if (!user) {
                await ctx.reply(code('Вы не зарегистрированы в системе!'));
                return;
            }
            this.openAiService.chatModel = GPT4;
            await ctx.deleteMessage();
            await ctx.reply(code(`Модель чата переключена на ${GPT4}`))
        } catch (e) {
            await ctx.reply(code('Вы не зарегистрированы в системе!'));
        }
    }

    @Command('developer')
    async onCodex(@Ctx() ctx: IContext, @UserName() userName: string) {
        try {
            const user = await this.userService.findOne(userName);
            if (!user) {
                await ctx.reply(code('Вы не зарегистрированы в системе!'));
                return;
            }
            this.openAiService.chatModel = CODEX;
            await ctx.deleteMessage();
            await ctx.reply(code(`Модель чата переключена на ${CODEX}. Она поможет вам в написании кода.`))
        } catch (e) {
            await ctx.reply(code('Вы не зарегистрированы в системе!'));
        }
    }

    @On('text')
    async getMessage(@Ctx() ctx: Context<any>, @UserName() userName: string) {
        try {
            const user = await this.userService.findOne(userName);
            if (!user) {
                await ctx.reply('Вы не зарегистрированы в системе!');
                return;
            }
            const {message_id} = await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));

            this.openAiService.setSessions = {name: userName, role: RolesType.USER, content: ctx.update.message.text}

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
                    await ctx.deleteMessage(message_id);
                    await ctx.reply(response.content);
                }
            }

        } catch (e: any) {
            await ctx.reply('Вы не зарегистрированы в системе!');
            console.log(`Error while text message ${e.message}`)
        }
    }

    @On('voice')
    async voiceCommand(@Ctx() ctx: Context<any>) {
        try {
            const {message_id} = await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));
            const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
            const userId = String(ctx.message.from.id);
            const oggFilePath = await this.converterService.create(link.href, userId);
            const mp3Path = await this.converterService.toMp3(oggFilePath, userId);
            const text = await this.openAiService.transcription(mp3Path);

            await ctx.reply(code(`Ваш запрос: ${text}`));

            this.openAiService.setSessions = {role: RolesType.USER, content: text}

            if (text!.match(/Сгенерируй изображение/i)) {
                const response = await this.openAiService.imageCreate(text as string);

                if (response) {
                    this.openAiService.setSessions = {role: RolesType.ASSISTANT, content: response}
                    await ctx.reply(response);
                }

            } else {
                const response = await this.openAiService.chat(this.openAiService.getSessions);

                if (response && response.content) {
                    this.openAiService.setSessions = {role: RolesType.ASSISTANT, content: response.content}
                    await ctx.deleteMessage(message_id);
                    await ctx.reply(response.content);
                }
            }

        } catch (e: any) {
            console.log(`Error while voice message ${e.message}`)
        }
    }
}
