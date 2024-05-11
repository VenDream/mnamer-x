import type { Metadata } from 'next';

// github
export const GITHUB_REPO = 'https://github.com/VenDream/mnamer-x';

// site metas
export const SITE_META: Metadata = {
  title: 'mnamer-x',
  description: 'Use LLMs to name your media files to be scrapers-friendly.',
};

// LLM server
export enum LLM_SERVER {
  OPEN_AI = 'openai',
  GROQ = 'groq',
}

// env configs
export const ENV_CONFIG = {
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  DEBUG_PROXY: process.env.DEBUG_PROXY,

  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  GROQ_API_KEY: process.env.GROQ_API_KEY,

  LLM_SERVER: process.env.LLM_SERVER || LLM_SERVER.OPEN_AI,
  LLM_MODEL: process.env.LLM_MODEL || 'gpt-3.5-turbo',

  TMDB_API_HOST: process.env.TMDB_API_HOST || 'https://api.themoviedb.org/3/',
  TMDB_API_KEY: process.env.TMDB_API_KEY,

  MAX_FILES_PER_TASK: process.env.NEXT_PUBLIC_MAX_FILES_PER_TASK
    ? +process.env.NEXT_PUBLIC_MAX_FILES_PER_TASK
    : 30,
};
