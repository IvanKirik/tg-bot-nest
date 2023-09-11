import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegrafException, TelegrafExecutionContext } from "nestjs-telegraf";
import { Context } from "telegraf";

@Injectable()
export class UserGuard implements CanActivate {
  private readonly ADMIN_IDS = ['ivankirik'];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const user = this.ADMIN_IDS.includes(from.username);
    return user;
  }
}
