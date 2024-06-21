import { WebDAVClientOptions as WebDAVClient } from 'webdav';

export enum LLM_SOURCE {
  BUILTIN = 'builtin',
  CUSTOM = 'custom',
}

export interface LLMSettings {
  source: LLM_SOURCE;
  options?: {
    baseUrl?: string;
    apiKey?: string;
    model?: string;
    temperature?: number;
  };
}

export enum LOCALE {
  EN = 'en-US',
  ZH = 'zh-CN',
}

export interface FormatterSettings {
  tpl?: string;
  locale?: LOCALE;
}

export type WebDAVClientOptions = WebDAVClient & {
  id: number;
  name: string;
  remoteURL: string;
};

export interface UserSettings {
  llm: LLMSettings;
  formatter: FormatterSettings;
  webdav: Record<number, WebDAVClientOptions>;
}
