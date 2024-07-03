import { CustomOutputParser } from '@/app/api/naming/output-parser';
import { ENV_CONFIG } from '@/constants';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

interface OpenAIModelOptions {
  prompt: ChatPromptTemplate;
  timeout?: number;
  temperature?: number;
  parser?: CustomOutputParser;
}

export const getOpenAILLM = (options: OpenAIModelOptions) => {
  const { prompt, timeout, temperature, parser } = options || {};

  const chatModel = new ChatOpenAI({
    model: ENV_CONFIG.OPENAI_MODEL,
    apiKey: ENV_CONFIG.OPENAI_API_KEY,
    temperature: temperature ?? 1,
    timeout: timeout ?? 10 * 1000,
    maxTokens: -1,
    configuration: {
      baseURL: ENV_CONFIG.OPENAI_BASE_URL,
    },
  });
  const llmChain = prompt.pipe(chatModel);

  return parser ? llmChain.pipe(parser) : llmChain;
};
