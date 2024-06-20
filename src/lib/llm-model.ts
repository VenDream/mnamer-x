import { ENV_CONFIG } from '@/constants';
import { ChatOpenAI } from '@langchain/openai';

console.log('env config: %O', ENV_CONFIG);

const chatModel = new ChatOpenAI({
  model: ENV_CONFIG.OPENAI_MODEL,
  apiKey: ENV_CONFIG.OPENAI_API_KEY,
  temperature: 1,
  timeout: 10 * 1000,
  configuration: {
    baseURL: ENV_CONFIG.OPENAI_BASE_URL,
  },
});

export default chatModel;
