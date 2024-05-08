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

export enum TASK_TYPE {
  MANUAL = 'manual',
  WEB_DAV = 'web-dav',
  CLOUD_STORAGE = 'cloud-storage',
}

export interface ProcessTask {
  type: TASK_TYPE;
  start: string;
  end: string;
  results: ProcessResult[];
}

export interface UserSettings {
  formatTpl?: string;
  llmMode: 'custom' | 'builtin';
  formatSettings?: {
    language?: string;
  };
  llmSettings?: {
    baseUrl: string;
    apiPath: string;
    apiKey: string;
    model: string;
    temperature: number;
  };
}
