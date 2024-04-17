import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const TMDB_CACHE = new Map<string, Record<string, any>>();

const instance = axios.create({
  baseURL: process.env.TMDB_API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add debug proxy if exists
if (process.env.DEBUG_PROXY) {
  const proxyAgent = new HttpsProxyAgent(process.env.DEBUG_PROXY);
  instance.defaults.httpAgent = proxyAgent;
  instance.defaults.httpsAgent = proxyAgent;
  console.log('using proxy', process.env.DEBUG_PROXY);
}

instance.interceptors.request.use(config => {
  if (!config.params) {
    config.params = {};
  }
  // set default language & api_key
  config.params = {
    ...config.params,
    language: 'zh-CN',
    api_key: process.env.TMDB_API_KEY,
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
  if (TMDB_CACHE.has(keyword)) {
    return TMDB_CACHE.get(keyword) as Record<string, any>;
  }

  console.log('searching tmdb with keyword: %s', keyword);
  const resp = await instance.get('/search/multi', {
    params: { query: keyword, include_adult: true, page: 1 },
  });
  TMDB_CACHE.set(keyword, resp.data);
  return resp.data;
}
