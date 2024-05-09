import chatModel from '@/app/_llm/model';
import { InputData } from '@/app/_pages/manual/manual';
import * as tmdb from '@/lib/tmdb-api';
import { buildErrorResponse, buildSuccessResponse } from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT, TEST_INPUT } from '@/prompts';
import { ProcessResult, TMDBData } from '@/types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CustomOutputParser } from './output-parser';

if (!chatModel) throw new Error('ERR_LLM_MODEL_NOT_FOUND');

const outputParser = new CustomOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function POST(req: Request) {
  const { files = [] } = (await req.json()) as InputData;
  const input = files.map(file => file.filename).join('\n');
  const output: ProcessResult[] = [];

  try {
    const parsedMeta = await llmChain.invoke({
      input: input || TEST_INPUT,
      format_instructions: outputParser.getFormatInstructions(),
    });
    for (const [idx, data] of Object.entries(parsedMeta)) {
      let result: Awaited<ReturnType<typeof tmdb.searchMedia>> | null = null;
      let mediaDetail: TMDBData | null = null;
      const { keyword } = files[+idx] || {};

      // try name first
      if (data.name) {
        result = await tmdb.searchMedia(data.name);
      }
      // then try keyword
      if (!mediaDetail && keyword) {
        result = await tmdb.searchMedia(keyword);
      }

      if (result?.type === 'tv') {
        mediaDetail = await tmdb.getTvDetail(result.id);
      } else if (result?.type === 'movie') {
        mediaDetail = await tmdb.getMovieDetail(result.id);
      }

      output.push({
        input: data.original,
        output: {
          meta: data,
          tmdb: mediaDetail,
        },
        modified: '',
      });
    }
    return Response.json(buildSuccessResponse(output));
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
