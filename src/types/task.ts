import { ManualInput } from '@/app/tasks/manual';
import { ParsedMeta } from '.';
import { LLMOptions, LOCALE } from './settings';
import { TMDBData } from './tmdb';

export interface WebDAVInput {
  type: TASK_TYPE.WEB_DAV;
  clientId: number;
  files: {
    dirpath: string;
    filename: string;
  }[];
}

export type InputData = (ManualInput | WebDAVInput) & {
  locale?: LOCALE;
  llmOptions?: LLMOptions;
};

export interface ProcessResult {
  input: string;
  output: {
    meta: ParsedMeta;
    tmdb: TMDBData | null;
  };
  modified?: string;
  webdav?: {
    clientId: number;
    dirpath: string;
  };
}

export interface FlattenedProcessResult extends Omit<ProcessResult, 'output'> {
  output: {
    meta: ParsedMeta;
    tmdbid: number;
  };
}

export enum TASK_TYPE {
  ALL = 'all',
  MANUAL = 'manual',
  WEB_DAV = 'web-dav',
  CLOUD_STORAGE = 'cloud-storage',
}

export interface ProcessTask {
  id: number;
  type: TASK_TYPE;
  start: string;
  end: string;
  results: ProcessResult[];
}

export interface FlattenedProcessTask extends Omit<ProcessTask, 'results'> {
  results: FlattenedProcessResult[];
}
