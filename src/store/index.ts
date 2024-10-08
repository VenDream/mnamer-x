import {
  FlattenedProcessTask,
  FormatterSettings,
  LLMSettings,
  LLM_SOURCE,
  LOCALE,
  ProcessResult,
  ProcessTask,
  TMDBData,
  UserSettings,
  WebDAVClientOptions,
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
  /** tasks */
  addTask: (task: ProcessTask) => void;
  removeTask: (tid: number) => void;
  updateTaskResult: (
    id: number,
    ridx: number,
    patch: Partial<ProcessResult>
  ) => void;
  /** llm */
  updateLLMSettings: (patch: Partial<LLMSettings>) => void;
  /** formatter */
  updateFormatterSettings: (patch: Partial<FormatterSettings>) => void;
  /** webdav */
  addWebDAV: (opts: WebDAVClientOptions) => void;
  removeWebDAV: (id: number) => void;
  updateWebDAVSettings: (
    id: number,
    patch: Partial<WebDAVClientOptions>
  ) => void;
  cleanTmdbs: () => void;
  resetSettings: () => void;
};

const DEFAULT_SETTINGS: UserSettings = {
  llm: {
    source: LLM_SOURCE.BUILTIN,
  },
  formatter: {
    locale: LOCALE.EN,
  },
  webdav: {},
};

const useStore = create<StoreState & StoreActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        tmdbs: {},
        tasks: {},
        settings: DEFAULT_SETTINGS,
        addTask: task => {
          set((state: StoreState) => {
            const fTask = flattenProcessTask(state.tmdbs, task);
            state.tasks[task.id] = fTask;
          });
        },
        removeTask: tid => {
          set((state: StoreState) => {
            delete state.tasks[tid];
          });
          get().cleanTmdbs();
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
        updateLLMSettings: patch => {
          set((state: StoreState) => {
            const llm = state.settings.llm;
            state.settings.llm = merge(llm, patch);
          });
        },
        updateFormatterSettings: patch => {
          set((state: StoreState) => {
            const formatter = state.settings.formatter;
            state.settings.formatter = merge(formatter, patch);
          });
        },
        addWebDAV: opts => {
          set((state: StoreState) => {
            state.settings.webdav[opts.id] = opts;
          });
        },
        removeWebDAV: id => {
          set((state: StoreState) => {
            delete state.settings.webdav[id];
          });
        },
        updateWebDAVSettings: (id, patch) => {
          set((state: StoreState) => {
            const client = state.settings.webdav[id];
            state.settings.webdav[id] = merge(client, patch);
          });
        },
        cleanTmdbs: () => {
          set((state: StoreState) => {
            const tmdbIds = Object.keys(state.tmdbs);
            const tasks = Object.values(state.tasks);

            tmdbIds.forEach(id => {
              const isReferred = tasks.some(t =>
                t.results.some(r => r.output.tmdbid === +id)
              );
              !isReferred && delete state.tmdbs[+id];
            });
          });
        },
        resetSettings: () => {
          set((state: StoreState) => {
            state.settings = DEFAULT_SETTINGS;
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
