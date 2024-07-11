import * as tmdb from '@/lib/tmdb-api';
import {
  LOCALE,
  ParsedMeta,
  ProcessResult,
  TMDBData,
  WebDAVInput,
} from '@/types';
import PromisePool from '@supercharge/promise-pool';

export async function execWebDAVTask(
  inputData: WebDAVInput & { locale?: LOCALE },
  data: ParsedMeta[]
) {
  const { files = [], locale } = inputData;
  const output: ProcessResult[] = [];

  await PromisePool.withConcurrency(10)
    .for(data)
    .useCorrespondingResults()
    .process(async (meta, idx) => {
      const file = files[idx] as WebDAVInput['files'][number];
      const { dirpath } = file || {};

      let mediaDetail: TMDBData | null = null;
      let result: Awaited<ReturnType<typeof tmdb.searchMedia>> | null = null;

      output[idx] = {
        input: meta.original,
        output: {
          meta,
          tmdb: mediaDetail,
        },
        modified: '',
        webdav: {
          clientId: inputData.clientId,
          dirpath,
        },
      };

      if (meta.name) {
        result = await tmdb.searchMedia({ keyword: meta.name, locale });
        if (result?.type === 'tv') {
          mediaDetail = await tmdb.getTvDetail({ id: result?.id, locale });
        } else if (result?.type === 'movie') {
          mediaDetail = await tmdb.getMovieDetail({ id: result?.id, locale });
        }

        output[idx].output.tmdb = mediaDetail;
      }
    });

  return output;
}
