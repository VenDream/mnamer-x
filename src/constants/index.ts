import type { Metadata } from 'next';

// app name
export const APP_NAME = 'MNAMER-X';

// github
export const GITHUB_REPO = 'https://github.com/VenDream/mnamer-x';

// site metas
export const SITE_META: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: 'Use LLMs to name your media files to be scrapers-friendly.',
};

export enum ROUTE {
  INDEX = '/',
  TASKS = '/tasks',
  HISTORY = '/history',
  SETTINGS = '/settings',
  CREDITS = '/credits',
}

// env configs
export const ENV_CONFIG = {
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  DEBUG_PROXY: process.env.DEBUG_PROXY,

  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',

  TMDB_API_HOST: process.env.TMDB_API_HOST || 'https://api.themoviedb.org/3/',
  TMDB_API_KEY: process.env.TMDB_API_KEY,

  MAX_FILES_PER_MANUAL_TASK: process.env.NEXT_PUBLIC_MAX_FILES_PER_MANUAL_TASK
    ? +process.env.NEXT_PUBLIC_MAX_FILES_PER_MANUAL_TASK
    : 30,
};
