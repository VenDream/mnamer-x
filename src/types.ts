import { WebDAVClientOptions as WebDAVClient } from 'webdav';

export interface Response<T = Record<string, any>> {
  code: number;
  data: T | null;
  errormsg: string | null;
}

export interface ParsedMeta {
  original: string;
  name: string;
  year: string;
  season: number;
  episode: number;
  resolution: string;
  misc: string;
  format: string;
}

export type TMDBMediaType = 'movie' | 'tv';

export interface TMDBBase {
  id: number;
  genres: string[];
  media_type: TMDBMediaType;
  overview: string;
  adult: boolean;
  popularity: number;
  vote_count: number;
  vote_average: number;
  poster_path: string;
  backdrop_path: string;
  origin_country: string[];
  original_language: string;
  genre_ids: number[];
  content_ratings: string;
}

export interface TMDBTv extends TMDBBase {
  name: string;
  original_name: string;
  media_type: 'tv';
  first_air_date: string;
}

export interface TMDBMovie extends TMDBBase {
  title: string;
  original_title: string;
  media_type: 'movie';
  release_date: string;
}

export type TMDBData = TMDBMovie | TMDBTv;

export interface ProcessResult {
  input: string;
  output: {
    meta: ParsedMeta;
    tmdb: TMDBData | null;
  };
  modified?: string;
}

export interface FlattenedProcessResult extends Omit<ProcessResult, 'output'> {
  output: {
    meta: ParsedMeta;
    tmdbid: number;
  };
}

export enum TASK_TYPE {
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

export interface FormatterSettings {
  tpl?: string;
  language?: string;
}

export type WebDAVClientOptions = WebDAVClient & { id: string };

export interface UserSettings {
  llm: LLMSettings;
  formatter: FormatterSettings;
  webdav: Record<string, WebDAVClientOptions>;
}
