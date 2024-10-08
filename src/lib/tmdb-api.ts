import { ENV_CONFIG } from '@/constants';
import { LOCALE, TMDBBase, TMDBMovie, TMDBTv } from '@/types';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { pick } from './utils';

const mediaKeys: (keyof TMDBBase)[] = [
  'id',
  'media_type',
  'overview',
  'adult',
  'genres',
  'popularity',
  'vote_count',
  'vote_average',
  'poster_path',
  'backdrop_path',
  'origin_country',
  'original_language',
  'genre_ids',
  'content_ratings',
];

const movieKeys: (keyof TMDBMovie)[] = [
  ...mediaKeys,
  'title',
  'original_title',
  'release_date',
];

const tvKeys: (keyof TMDBTv)[] = [
  ...mediaKeys,
  'name',
  'original_name',
  'first_air_date',
];

const instance = axios.create({
  baseURL: ENV_CONFIG.TMDB_API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add debug proxy if exists
if (ENV_CONFIG.DEBUG_PROXY) {
  const proxyAgent = new HttpsProxyAgent(ENV_CONFIG.DEBUG_PROXY);
  instance.defaults.httpAgent = proxyAgent;
  instance.defaults.httpsAgent = proxyAgent;
  console.log('using proxy', ENV_CONFIG.DEBUG_PROXY);
}

instance.interceptors.request.use(config => {
  if (!config.params) {
    config.params = {};
  }
  // set default language & api_key
  config.params = {
    language: 'zh-CN',
    ...config.params,
    api_key: ENV_CONFIG.TMDB_API_KEY,
  };
  return config;
});

interface SearchMediaParams {
  keyword: string;
  year?: string;
  locale?: LOCALE;
}

/**
 * search media from tmdb
 *
 * @export
 * @param {SearchMediaParams} params params
 */
export async function searchMedia(params: SearchMediaParams) {
  const { keyword, year, locale } = params;
  console.log('searching tmdb media info with keyword: %s', keyword);
  const resp = await instance.get('/search/multi', {
    params: { query: keyword, language: locale, include_adult: true, page: 1 },
  });
  const results = (resp?.data?.results || []) as TMDBBase[];
  // pick the first result by default
  let result = results[0];
  // use year to pick a more precise result if possible
  if (year) {
    result =
      results.find(r => {
        return r.media_type === 'movie'
          ? (r as TMDBMovie).release_date?.includes(year)
          : (r as TMDBTv).first_air_date?.includes(year);
      }) || result;
  }
  return { id: result.id, type: result.media_type };
}

interface GetMediaDetailParams {
  id: number;
  locale?: LOCALE;
}

/**
 * get movie detail
 *
 * @export
 * @param {GetMediaDetailParams} params params
 */
export async function getMovieDetail(params: GetMediaDetailParams) {
  const { id, locale } = params;
  console.log('fetching tmdb movie detail with id: %s', id);
  const resp = await instance.get(`/movie/${id}`, {
    params: {
      language: locale,
      append_to_response: 'releases',
    },
  });
  const movie = pick(resp?.data, movieKeys);
  movie.media_type = 'movie';
  movie.genres = movie.genres.map((g: Record<string, any>) => g.name);
  movie.content_ratings =
    resp?.data?.releases?.countries?.find(
      (cr: Record<string, any>) => cr.iso_3166_1 === 'US'
    )?.certification || '';
  return movie as TMDBMovie;
}

type GetTvDetailParams = GetMediaDetailParams;

/**
 * get tv detail
 *
 * @export
 * @param {GetTvDetailParams} params params
 */
export async function getTvDetail(params: GetTvDetailParams) {
  const { id, locale } = params;
  console.log('fetching tmdb tv detail with id: %s', id);
  const resp = await instance.get(`/tv/${id}`, {
    params: {
      language: locale,
      append_to_response: 'content_ratings',
    },
  });
  const tv = pick(resp?.data, tvKeys);
  tv.media_type = 'tv';
  tv.genres = tv.genres.map((g: Record<string, any>) => g.name);
  tv.content_ratings =
    resp?.data?.content_ratings?.results.find(
      (cr: Record<string, any>) => cr.iso_3166_1 === 'US'
    )?.rating || '';
  return tv as TMDBTv;
}
