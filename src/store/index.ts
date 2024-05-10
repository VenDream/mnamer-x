import {
  FlattenedProcessTask,
  ProcessResult,
  ProcessTask,
  TMDBData,
  UserSettings,
} from '@/types';
import merge from 'lodash.merge';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { flattenProcessResult, flattenProcessTask } from './transformer';

export type StoreState = {
  tmdbs: Record<number, TMDBData>;
  tasks: Record<number, FlattenedProcessTask>;
  settings: UserSettings;
};

export type StoreActions = {
  addTask: (task: ProcessTask) => void;
  updateTaskResult: (
    id: number,
    ridx: number,
    patch: Partial<ProcessResult>
  ) => void;
};

const useStore = create<StoreState & StoreActions>()(
  devtools(
    persist(
      immer(set => ({
        tmdbs: {},
        tasks: {},
        settings: {
          llmMode: 'builtin',
          formatSettings: {
            language: 'zh-CN',
          },
        },
        addTask: task => {
          set((state: StoreState) => {
            const fTask = flattenProcessTask(state.tmdbs, task);
            state.tasks[task.id] = fTask;
          });
        },
        updateTaskResult: (id, idx, patch) => {
          set((state: StoreState) => {
            const task = state.tasks[id];
            const result = task.results[idx];
            const fPatch = flattenProcessResult(state.tmdbs, patch);
            task.results[idx] = merge(result, fPatch);
            state.tasks[id] = task;
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
