import { exclude } from '@/lib/utils';
import {
  FlattenedProcessResult,
  FlattenedProcessTask,
  ProcessResult,
  ProcessTask,
} from '@/types';
import { StoreState } from '.';

export function flattenProcessResult(
  tmdbs: StoreState['tmdbs'],
  result: ProcessResult | Partial<ProcessResult>
) {
  const { meta, tmdb } = result.output || {};
  const fResult = exclude(result, ['output']);
  fResult.output = {};
  meta && (fResult.output.meta = meta);
  if (tmdb) {
    fResult.output.tmdbid = tmdb.id || -1;
    tmdbs[tmdb.id] = tmdb;
  }
  return fResult as FlattenedProcessResult;
}

export function flattenProcessTask(
  tmdbs: StoreState['tmdbs'],
  task: ProcessTask
) {
  const fResults = task.results.map(r => flattenProcessResult(tmdbs, r));
  const fTask: FlattenedProcessTask = {
    ...task,
    results: fResults,
  };
  return fTask;
}

export function structuralizeProcessResult(
  tmdbs: StoreState['tmdbs'],
  flattenedResult: FlattenedProcessResult
) {
  const result: ProcessResult = {
    ...flattenedResult,
    output: {
      meta: flattenedResult.output.meta,
      tmdb: tmdbs[flattenedResult.output.tmdbid],
    },
  };
  return result;
}

export function structuralizeProcessTask(
  tmdbs: StoreState['tmdbs'],
  flattenedTask: FlattenedProcessTask
) {
  const results = flattenedTask.results.map(r =>
    structuralizeProcessResult(tmdbs, r)
  );
  const processTask: ProcessTask = {
    ...flattenedTask,
    results,
  };
  return processTask;
}
