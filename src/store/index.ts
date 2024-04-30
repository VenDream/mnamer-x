import { ProcessResult, ProcessTask, UserSettings } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type StoreState = {
  history: ProcessTask[];
  settings: UserSettings;
};

type StoreActions = {
  addTask: (task: ProcessTask) => void;
  updateTaskResult: (
    tidx: number,
    ridx: number,
    patch: Partial<ProcessResult>
  ) => void;
};

const useStore = create<StoreState & StoreActions>()(
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
        addTask: task => {
          set((state: StoreState) => {
            state.history.push(task);
          });
        },
        updateTaskResult: (tidx, ridx, patch) => {
          set((state: StoreState) => {
            const task = state.history[tidx];
            const result = task.results[ridx];
            task.results[ridx] = { ...result, ...patch };
            state.history[tidx] = task;
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

type BoundStore = typeof useStore;

export { useStore };
export type { BoundStore };
