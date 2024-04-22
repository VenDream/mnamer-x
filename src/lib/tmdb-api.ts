import { ENV_CONFIG } from '@/constants';
import { TMDBData } from '@/types';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const TMDB_CACHE = new Map<string, TMDBData>();

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
    ...config.params,
    language: 'zh-CN',
    api_key: ENV_CONFIG.TMDB_API_KEY,
  };
  return config;
});

/**
 * search media info
 *
 * @export
 * @param {string} keyword keyword
 */
export async function searchMedia(keyword: string) {
  if (TMDB_CACHE.has(keyword)) return TMDB_CACHE.get(keyword) as TMDBData;

  console.log('searching tmdb with keyword: %s', keyword);
  const resp = await instance.get('/search/multi', {
    params: { query: keyword, include_adult: true, page: 1 },
  });
  const mediaInfo = resp?.data?.results?.[0] as TMDBData;
  TMDB_CACHE.set(keyword, mediaInfo);
  return mediaInfo;
}
