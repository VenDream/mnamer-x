import { stripJsonCodeBlockMarkup } from '@/lib/utils';
import { ParsedMeta } from '@/types';
import {
  BaseOutputParser,
  OutputParserException,
} from '@langchain/core/output_parsers';

export interface CustomOutputParserFields {}

export type ExpectedOutput = ParsedMeta[];

export class CustomOutputParser extends BaseOutputParser<ExpectedOutput> {
  lc_namespace = ['langchain', 'output_parsers'];

  constructor(fields?: CustomOutputParserFields) {
    super(fields);
  }

  async parse(llmOutput: string): Promise<ExpectedOutput> {
    let result;
    try {
      const strippedLlmOutput = stripJsonCodeBlockMarkup(llmOutput);
      console.log('stripped LLM output: %s', strippedLlmOutput);
      result = JSON.parse(strippedLlmOutput);
      console.log('parsed result: %O', result);
    } catch (e) {
      const error = e as Error;
      console.error('failed to parse LLM output: %s', error.message);
      throw new OutputParserException('Failed to parse LLM output');
    }
    return result;
  }

  getFormatInstructions(): string {
    return `
      Your output MUST be a JSON array, starting with '[' and ending with ']'.
      DO NOT add any extra explanations or markdown syntax.
    `;
  }
}
