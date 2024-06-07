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
