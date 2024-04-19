import { ENV_CONFIG } from '@/constants';
import * as tmdb from '@/lib/tmdb-api';
import {
  buildErrorResponse,
  buildSuccessResponse,
  getFileSuffix,
  zeroPad,
} from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT, TEST_INPUT } from '@/prompts';
import { ParsedMeta, TMDBMovie, TMDBTv } from '@/types';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

console.log('env config: %O', ENV_CONFIG);

const chatModel = new ChatOpenAI({
  model: ENV_CONFIG.LLM,
  timeout: 10 * 1000,
  temperature: 0,
  configuration: {
    baseURL: ENV_CONFIG.OPENAI_BASE_URL,
  },
});
const outputParser = new StringOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function POST(req: Request) {
  const { topic, files } = await req.json();

  try {
    const response = await llmChain.invoke({ input: files || TEST_INPUT });
    const data = (JSON.parse(response) as ParsedMeta[]).filter(Boolean);
    console.log('parsed meta data: %O', data);
    if (!data || data.length <= 0) {
      return Response.json(buildSuccessResponse([]));
    }
    for (const [
      idx,
      { original, name, season, episode, resolution, misc },
    ] of Object.entries(data)) {
      const tmdbData = await tmdb.searchMedia(name);
      const mediaInfo = tmdbData?.results?.[0];
      if (mediaInfo) {
        const isTv = mediaInfo.media_type === 'tv';
        const isMovie = mediaInfo.media_type === 'movie';
        const suffix = getFileSuffix(original);

        if (isTv) {
          const { name, first_air_date } = mediaInfo as TMDBTv;
          const year = first_air_date.split('-')[0];
          const se = `S${zeroPad(season)}E${zeroPad(episode)}`;
          data[+idx].formattedName =
            `${name}.${year}.${se}.${resolution}.${misc}.${suffix}`;
        }

        if (isMovie) {
          const { title, release_date } = mediaInfo as TMDBMovie;
          const year = release_date.split('-')[0];
          data[+idx].formattedName =
            `${title}.${year}.${resolution}.${misc}.${suffix}`;
        }
      }
    }
    return Response.json(
      buildSuccessResponse(
        data.map(d => ({
          input: d.original,
          output: d.formattedName || '',
          meta: {
            name: d.name,
            season: d.season,
            episode: d.episode,
            resolution: d.resolution,
            misc: d.misc,
          },
        }))
      )
    );
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
