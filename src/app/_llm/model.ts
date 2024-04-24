import { ENV_CONFIG, LLM_SERVER } from '@/constants';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';

type LLM = ChatOpenAI | ChatGroq;

console.log('env config: %O', ENV_CONFIG);

let chatModel: LLM | null = null;
switch (ENV_CONFIG.LLM_SERVER) {
  case LLM_SERVER.OPEN_AI: {
    chatModel = new ChatOpenAI({
      model: ENV_CONFIG.LLM_MODEL,
      apiKey: ENV_CONFIG.OPENAI_API_KEY,
      temperature: 0,
      timeout: 10 * 1000,
      configuration: {
        baseURL: ENV_CONFIG.OPENAI_BASE_URL,
      },
    });
    break;
  }
  case LLM_SERVER.GROQ: {
    chatModel = new ChatGroq({
      model: ENV_CONFIG.LLM_MODEL,
      apiKey: ENV_CONFIG.GROQ_API_KEY,
      temperature: 0,
    });
    break;
  }
  default:
    break;
}

export default chatModel;
