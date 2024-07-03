import { getOpenAILLM } from '@/lib/llm-model';
import { buildErrorResponse, buildSuccessResponse } from '@/lib/utils';
import { SYSTEM_AGENT_PROMPT } from '@/prompts';
import { InputData, ParsedMeta, ProcessResult, TASK_TYPE } from '@/types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { execManualTask } from './manual';
import { CustomOutputParser } from './output-parser';
import { execWebDAVTask } from './webdav';

const outputParser = new CustomOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_AGENT_PROMPT],
  ['user', '{input}'],
]);

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
    const llm = getOpenAILLM({ prompt, parser: outputParser });
    const parsedMetas = (await llm.invoke({
      input,
      format_instructions: outputParser.getFormatInstructions(),
    })) as ParsedMeta[];

    switch (type) {
      case TASK_TYPE.MANUAL:
        output = await execManualTask(inputData, parsedMetas);
        break;
      case TASK_TYPE.WEB_DAV:
        output = await execWebDAVTask(inputData, parsedMetas);
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
