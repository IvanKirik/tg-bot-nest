import { ModuleMetadata } from "@nestjs/common";

export interface IOpenAiOptionsInterface {
  apiKey: string;
}

export interface IOpenAiModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<IOpenAiOptionsInterface> | IOpenAiOptionsInterface;
  inject?: any[];
}
