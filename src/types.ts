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

export interface TMDBTv {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  media_type: 'movie' | 'tv';
  adult: boolean;
  popularity: number;
  vote_count: number;
  vote_average: number;
  poster_path: string;
  backdrop_path: 'string';
  first_air_date: string;
  origin_country: string[];
  original_language: string;
  genre_ids: number[];
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  media_type: 'movie';
  adult: boolean;
  popularity: number;
  vote_count: number;
  vote_average: number;
  poster_path: string;
  backdrop_path: 'string';
  release_date: string;
  origin_country: string[];
  original_language: string;
  genre_ids: number[];
}

export type TMDBData = TMDBMovie | TMDBTv;

export interface ProcessResult {
  input: string;
  output: {
    meta: ParsedMeta;
    tmdb: TMDBData | null;
  };
}
