import { ProcessResult, ProcessTask, UserSettings } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
// import type {} from '@redux-devtools/extension';

export interface StoreState {
  history: ProcessTask[];
  settings: UserSettings;
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      immer(set => ({
        history: [],
        settings: {
          llmMode: 'builtin',
          formatSettings: {
            language: 'zh-CN',
          },
        },
        addTask: (task: ProcessTask) => {
          set(state => {
            state.history.push(task);
          });
        },
        updateTaskResult: (idx: number, patch: Partial<ProcessResult>) => {
          set(state => {
            // const task = state.history[idx];
            state.history[idx] = {
              ...state.history[idx],
              ...patch,
            };
          });
        },
      })),
      {
        name: 'MNAMER_X_DATA',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useStore;
