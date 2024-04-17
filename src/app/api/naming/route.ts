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

const chatModel = new ChatOpenAI({
  model: 'gpt-3.5-turbo-0613',
  temperature: 0,
});
const outputParser = new StringOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function GET() {
  const response = await llmChain.invoke({ input: TEST_INPUT });

  try {
    const data = JSON.parse(response) as ParsedMeta[];
    for (const [
      idx,
      { original, name, season, episode, resolution },
    ] of Object.entries(data)) {
      const tmdbData = await tmdb.searchMedia(name);
      const mediaInfo = tmdbData?.data?.results?.[0];
      if (mediaInfo) {
        const isTv = mediaInfo.media_type === 'tv';
        const isMovie = mediaInfo.media_type === 'movie';
        const suffix = getFileSuffix(original);

        if (isTv) {
          const { name, first_air_date } = mediaInfo as TMDBTv;
          const year = first_air_date.split('-')[0];
          data[+idx].formattedName =
            `${name}.${year}.S${zeroPad(season)}E${zeroPad(episode)}.${resolution}.${suffix}`;
        }

        if (isMovie) {
          const { title, release_date } = mediaInfo as TMDBMovie;
          const year = release_date.split('-')[0];
          data[+idx].formattedName = `${title}.${year}.${resolution}.${suffix}`;
        }
      }
    }
    return Response.json(buildSuccessResponse(data));
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
