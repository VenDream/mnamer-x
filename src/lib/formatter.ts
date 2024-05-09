import {
  ParsedMeta,
  ProcessResult,
  TMDBData,
  TMDBMovie,
  TMDBTv,
} from '@/types';
import { zeroPad } from './utils';

const UNRECOGNIZED_TIPS = 'Unable to recognize.';

export function getFormattedFilename(result: ProcessResult) {
  const { meta, tmdb } = result.output;

  if (!tmdb) return UNRECOGNIZED_TIPS;

  if (tmdb.media_type === 'movie') {
    return getFormattedMovieName(meta, tmdb as TMDBMovie);
  } else if (tmdb.media_type === 'tv') {
    return getFormattedTvName(meta, tmdb as TMDBTv);
  }

  return UNRECOGNIZED_TIPS;
}

export function getMediaReleaseYear(media: TMDBData) {
  if (media.media_type === 'movie') {
    const { release_date } = media as TMDBMovie;
    return release_date.split('-')[0];
  } else if (media.media_type === 'tv') {
    const { first_air_date } = media as TMDBTv;
    return first_air_date.split('-')[0];
  } else {
    return 'unknown';
  }
}

function getFormattedMovieName(meta: ParsedMeta, movie: TMDBMovie) {
  const { misc, format, resolution } = meta;
  const { title } = movie;

  const year = getMediaReleaseYear(movie);
  let filename = `${title}.${year}`;

  if (resolution) filename += `.${resolution}`;
  if (misc) filename += `.${misc}`;
  if (format) filename += `.${format}`;

  return filename;
}

function getFormattedTvName(meta: ParsedMeta, tv: TMDBTv) {
  const { season, episode, misc, format, resolution } = meta;
  const { name, first_air_date } = tv;

  const year = getMediaReleaseYear(tv);
  let filename = `${name}.${year}.S${zeroPad(season, 2)}E${zeroPad(episode, 2)}`;

  if (resolution) filename += `.${resolution}`;
  if (misc) filename += `.${misc}`;
  if (format) filename += `.${format}`;

  return filename;
}
