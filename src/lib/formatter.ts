import { ParsedMeta, ProcessResult, TMDBMovie, TMDBTv } from '@/types';
import { zeroPad } from './utils';

export default function getFormattedFilename(result: ProcessResult) {
  const { meta, tmdb } = result.output;

  if (!tmdb) return 'Unable to recognize.';

  if (tmdb.media_type === 'movie') {
    return getFormattedMovieName(meta, tmdb as TMDBMovie);
  } else if (tmdb.media_type === 'tv') {
    return getFormattedTvName(meta, tmdb as TMDBTv);
  }

  return 'Unable to recognize.';
}

function getFormattedMovieName(meta: ParsedMeta, movie: TMDBMovie) {
  const { misc, format, resolution } = meta;
  const { title, release_date } = movie;

  const year = release_date.split('-')[0];
  let filename = `${title}.${year}.${resolution}`;

  if (misc) filename += `.${misc}`;
  if (format) filename += `.${format}`;

  return filename;
}

function getFormattedTvName(meta: ParsedMeta, tv: TMDBTv) {
  const { season, episode, misc, format, resolution } = meta;
  const { name, first_air_date } = tv;

  const year = first_air_date.split('-')[0];
  let filename = `${name}.${year}.S${zeroPad(season, 2)}E${zeroPad(episode, 2)}.${resolution}`;

  if (misc) filename += `.${misc}`;
  if (format) filename += `.${format}`;

  return filename;
}
