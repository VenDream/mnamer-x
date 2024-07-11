import { ManualInput } from '@/app/tasks/manual';
import { useStore } from '@/store';
import { InputData, LLM_SOURCE, WebDAVInput } from '@/types';
import { useCallback } from 'react';

export function useInputData() {
  const { llm, formatter } = useStore(state => state.settings);
  const { source, options } = llm;

  const getInputData = useCallback(
    (input: WebDAVInput | ManualInput) => {
      const inputData: InputData = {
        ...input,
        locale: formatter.locale,
      };
      if (source === LLM_SOURCE.CUSTOM && options) {
        inputData.llmOptions = options;
      }

      return inputData;
    },
    [formatter.locale, options, source]
  );

  return getInputData;
}
