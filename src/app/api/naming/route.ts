import { ManualInput } from '@/app/tasks/manual';
import chatModel from '@/lib/llm-model';
import * as tmdb from '@/lib/tmdb-api';
import { buildErrorResponse, buildSuccessResponse } from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT, TEST_INPUT } from '@/prompts';
import { InputData, ProcessResult, TASK_TYPE, TMDBData } from '@/types';
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
  const { type, files = [] } = (await req.json()) as InputData;
  const input = files.map(file => file.filename).join('\n');
  const output: ProcessResult[] = [];

  console.log('task input: %O', files);

  try {
    const parsedMeta = await llmChain.invoke({
      input: input || TEST_INPUT,
      format_instructions: outputParser.getFormatInstructions(),
    });

    // Manual
    if (type === TASK_TYPE.MANUAL) {
      for (const [idx, data] of Object.entries(parsedMeta)) {
        const file = files[+idx] as ManualInput['files'][number];
        const { year, keyword } = file || {};

        let mediaDetail: TMDBData | null = null;
        let result: Awaited<ReturnType<typeof tmdb.searchMedia>> | null = null;

        // try name first
        if (data.name) {
          result = await tmdb.searchMedia(data.name, year);
        }
        // then try keyword
        if (!mediaDetail && keyword) {
          result = await tmdb.searchMedia(keyword, year);
        }

        if (result?.type === 'tv') {
          mediaDetail = await tmdb.getTvDetail(result?.id);
        } else if (result?.type === 'movie') {
          mediaDetail = await tmdb.getMovieDetail(result?.id);
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
    }

    return Response.json(buildSuccessResponse(output));
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
