import { Response } from '@/types';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const cache = new Map<string, Record<string, any>>();

const instance = axios.create({
  baseURL: process.env.TMDB_API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
  config.params = {
    ...config.params,
    language: 'zh-CN',
    api_key: process.env.TMDB_API_KEY,
  };
  return config;
});
instance.interceptors.response.use(
  resp => {
    const response: Response = {
      code: 0,
      data: resp.data,
      errormsg: null,
    };
    return response as any;
  },
  err => {
    if (err.response.data) {
      const { status_code, status_message } = err.response.data;
      const response: Response = {
        code: +status_code,
        data: null,
        errormsg: '[TMDB] ' + status_message,
      };
      return response;
    }
    return Promise.reject(err);
  }
);

/**
 * search media info
 *
 * @export
 * @param {string} keyword keyword
 */
export async function searchMedia(keyword: string) {
  if (cache.has(keyword)) {
    return cache.get(keyword) as Record<string, any>;
  }

  console.log('searching tmdb with keyword: %s', keyword);
  const resp = (await instance.get('/search/multi', {
    params: { query: keyword, include_adult: true, page: 1 },
  })) as Record<string, any>;
  cache.set(keyword, resp);
  return resp;
}
