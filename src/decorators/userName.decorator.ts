import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const UserName = createParamDecorator(
  (data: unknown, ctx: ExecutionContextHost) => {
    const context = ctx.getArgs();
    return context[0].update.message.from.username || context[0].update.message.from.first_name;
  }
)
