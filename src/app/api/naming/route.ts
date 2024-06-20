import chatModel from '@/lib/llm-model';
import { buildErrorResponse, buildSuccessResponse } from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT } from '@/prompts';
import { InputData, ProcessResult, TASK_TYPE } from '@/types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { execManualTask } from './manual';
import { CustomOutputParser } from './output-parser';
import { execWebDAVTask } from './webdav';

if (!chatModel) throw new Error('ERR_LLM_INSTANCE_NOT_FOUND');

const outputParser = new CustomOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function POST(req: Request) {
  const inputData: InputData = await req.json();
  const { type, files = [] } = inputData;
  const input = files.map(file => file.filename).join('\n');
  let output: ProcessResult[] = [];

  console.log('input files: %O', input);

  if (files.length === 0) {
    return Response.json(buildSuccessResponse(output));
  }

  try {
    const parsedMeta = await llmChain.invoke({
      input,
      format_instructions: outputParser.getFormatInstructions(),
    });

    switch (type) {
      case TASK_TYPE.MANUAL:
        output = await execManualTask(inputData, parsedMeta);
        break;
      case TASK_TYPE.WEB_DAV:
        output = await execWebDAVTask(inputData, parsedMeta);
        break;
      default:
        break;
    }

    return Response.json(buildSuccessResponse(output));
  } catch (err) {
    const error = err as Error;
    return Response.json(buildErrorResponse(1, error.message));
  }
}
