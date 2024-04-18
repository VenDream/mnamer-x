import type { Metadata } from 'next';

// site metas
export const SITE_META: Metadata = {
  title: 'mnamer-x',
  description: 'Use LLMs to name your media files to be scrapers-friendly.',
};

// env configs
export const ENV_CONFIG = {
  DEBUG_PROXY: process.env.DEBUG_PROXY,

  LLM: process.env.LLM || 'gpt-3.5-turbo',

  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  TMDB_API_HOST: process.env.TMDB_API_HOST || 'https://api.themoviedb.org/3/',
  TMDB_API_KEY: process.env.TMDB_API_KEY,
};
