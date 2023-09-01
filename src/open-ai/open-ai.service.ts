import { Global, Inject, Injectable } from "@nestjs/common";
import { OPEN_AI_OPTIONS } from "./openAi.constants";
import { IOpenAiOptionsInterface } from "./openAi.interface";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { ChatModel } from "../type/chatModel.type";

@Global()
@Injectable()
export class OpenAiService {

    public options: Configuration;
    public model: ChatModel;
    private openAi: OpenAIApi;
    private sessions: ChatCompletionRequestMessage[] = [];

    get getSessions(): ChatCompletionRequestMessage[] {
        return this.sessions;
    }

    set setSessions(session:ChatCompletionRequestMessage) {
        this.sessions.push(session)
    }

    set chatModel(model: ChatModel) {
        this.model = model;
    }

    constructor(
      @Inject(OPEN_AI_OPTIONS) options: IOpenAiOptionsInterface,
    ) {
        this.options = new Configuration({apiKey: options.apiKey});
        this.openAi = new OpenAIApi(this.options);

    }

    public async chat(messages: ChatCompletionRequestMessage[]) {
        try {
            // console.log(this.model);
            const response = await this.openAi.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages,
            })
            return response.data.choices[0].message;
        } catch (e: any) {
            console.log(`Error while gpt chat ${e.message}`);
        }
    }

    public async imageCreate(description: string) {
        try {
            const response = await this.openAi.createImage({
                prompt: description,
                n: 1,
                size: "256x256",
            })

            return response.data.data[0].url;

        } catch (e) {
            console.log(`Error while create image`)
        }
    }
}
