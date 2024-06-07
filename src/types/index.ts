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

export * from './settings';
export * from './task';
export * from './tmdb';
