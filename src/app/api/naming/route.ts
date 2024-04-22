import chatModel from '@/app/_llm/model';
import { InputData } from '@/app/_pages/manual/manual';
import * as tmdb from '@/lib/tmdb-api';
import { buildErrorResponse, buildSuccessResponse } from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT, TEST_INPUT } from '@/prompts';
import { ParsedMeta, ProcessResult, TMDBData } from '@/types';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

if (!chatModel) throw new Error('ERR_LLM_MODEL_NOT_FOUND');

const outputParser = new StringOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function POST(req: Request) {
  const { files } = (await req.json()) as InputData;
  const input = files.map(file => file.filename).join('\n');
  const output: ProcessResult[] = [];

  try {
    const response = await llmChain.invoke({ input: input || TEST_INPUT });
    const parsedMeta = (JSON.parse(response) as ParsedMeta[]).filter(Boolean);
    console.log('parsed meta data: %O', parsedMeta);
    for (const [idx, data] of Object.entries(parsedMeta)) {
      let mediaInfo: TMDBData | null = null;
      const { keyword } = files[+idx];

      // try name first
      if (data.name) {
        mediaInfo = await tmdb.searchMedia(data.name);
      }
      // then try keyword
      if (!mediaInfo && keyword) {
        mediaInfo = await tmdb.searchMedia(keyword);
      }

      output.push({
        input: data.original,
        output: {
          meta: data,
          tmdb: mediaInfo,
        },
      });
    }
    return Response.json(buildSuccessResponse(output));
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
