export interface Response {
  code: number;
  data: Record<string, any> | null;
  errormsg: string | null;
}

export interface ParsedMeta {
  original: string;
  name: string;
  season: number;
  episode: number;
  resolution: string;
  misc: string;
  [key: string]: any;
}

export interface TMDBMovie {
  id: string;
  media_type: 'movie';
  title: string;
  release_date: string;
}

export interface TMDBTv {
  id: string;
  media_type: 'tv';
  name: string;
  first_air_date: string;
}
