const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export function getTmdbImageUrl(path: string, varient = 'w500') {
  return TMDB_IMAGE_BASE_URL + varient + path;
}
