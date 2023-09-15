import {NEW_USER_SCENES} from "../telegram.constants";
import {Ctx, Message, On, Wizard, WizardStep} from "nestjs-telegraf";
import {WizardContext} from "telegraf/typings/scenes";

@Wizard(NEW_USER_SCENES)
export class NewUserScene {
    @WizardStep(1)
    async onSceneEnter(@Ctx() ctx: WizardContext) {
        await ctx.reply('Введите имя нового пользователя!')
        ctx.wizard.next();
        return 'Новый пользователь зарегистрирован!';
    }

    @On('text')
    @WizardStep(2)
    async registrationNewUser(@Ctx() ctx: WizardContext, @Message() msg: { text: string }): Promise<string> {
        console.log(msg)
        await ctx.scene.leave();
        return 'Новый пользователь зарегистрирован!';
    }

}