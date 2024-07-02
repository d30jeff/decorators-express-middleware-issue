import { Express } from 'express';
import { Signale } from 'signale';

export namespace Application {
  export type Instance = {
    app: Express;
  };

  export type CreateApplicationParams = {
    name: string;
    controllers: any[];
    origin: string[];
    staticPaths?: Array<{ prefix: string; path: string; enabled: boolean }>;
    logRequests?: boolean;
  };

  export namespace Helper {
    export type WithParamsOption<T> = T & {
      throwWhenNotFound?: boolean;
      throwIfExists?: boolean;
    };
  }
}
