import * as tmdb from '@/lib/tmdb-api';
import { ParsedMeta, ProcessResult, TMDBData, WebDAVInput } from '@/types';
import PromisePool from '@supercharge/promise-pool';

export async function execWebDAVTask(
  inputData: WebDAVInput,
  data: ParsedMeta[]
) {
  const { files = [] } = inputData;
  const output: ProcessResult[] = [];

  await PromisePool.withConcurrency(10)
    .for(data)
    .useCorrespondingResults()
    .process(async (meta, idx) => {
      const file = files[idx] as WebDAVInput['files'][number];
      const { dirpath } = file || {};

      let mediaDetail: TMDBData | null = null;
      let result: Awaited<ReturnType<typeof tmdb.searchMedia>> | null = null;

      result = await tmdb.searchMedia(meta.name);

      console.log('[%s] result: %O', idx, result);

      if (result?.type === 'tv') {
        mediaDetail = await tmdb.getTvDetail(result?.id);
      } else if (result?.type === 'movie') {
        mediaDetail = await tmdb.getMovieDetail(result?.id);
      }

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
    });

  return output;
}
