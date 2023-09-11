import { Markup } from "telegraf";
import { GET_USERS} from "./telegram.constants";
import { GPT3, GPT4 } from "../open-ai/openAi.constants";

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback(GET_USERS, GET_USERS),
      Markup.button.callback(GPT3, GPT3),
      Markup.button.callback(GPT4, GPT4),
    ],
    {
      columns: 3
    }
  ).resize()
}
