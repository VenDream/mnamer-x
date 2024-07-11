import { CustomOutputParser } from '@/app/api/naming/output-parser';
import { ENV_CONFIG } from '@/constants';
import { LLMOptions } from '@/types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

interface OpenAIModelOptions {
  prompt: ChatPromptTemplate;
  timeout?: number;
  parser?: CustomOutputParser;
  options?: LLMOptions;
}

export const getOpenAILLM = (options: OpenAIModelOptions) => {
  const { prompt, timeout, parser, options: llmOptions } = options || {};
  const { temperature, baseUrl, apiKey, model } = llmOptions || {};

  const chatModel = new ChatOpenAI({
    model: model || ENV_CONFIG.OPENAI_MODEL,
    apiKey: apiKey || ENV_CONFIG.OPENAI_API_KEY,
    temperature: temperature ?? 1,
    timeout: timeout ?? 10 * 1000,
    maxTokens: -1,
    configuration: {
      baseURL: baseUrl || ENV_CONFIG.OPENAI_BASE_URL,
    },
  });
  const llmChain = prompt.pipe(chatModel);

  return parser ? llmChain.pipe(parser) : llmChain;
};
