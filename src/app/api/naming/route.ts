import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

const chatModel = new ChatOpenAI({
  model: 'gpt-4-turbo',
});
const outputParser = new StringOutputParser();
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a world class technical documentation writer.'],
  ['user', '{input}'],
]);
const llmChain = prompt.pipe(chatModel).pipe(outputParser);

export async function GET() {
  const response = await llmChain.invoke({
    input: 'what is LangSmith?',
  });
  return Response.json({ agent: response });
}
