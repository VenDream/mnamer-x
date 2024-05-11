import { useStore } from '@/store';
import { structuralizeProcessResult } from '@/store/transformer';
import { useMemo } from 'react';

export function useProcessResults(tid: number) {
  const tmdbs = useStore(state => state.tmdbs);
  const { results: fResults = [] } = useStore(store => store.tasks[tid]) || {};
  const results = useMemo(
    () =>
      tid < 0 ? [] : fResults.map(r => structuralizeProcessResult(tmdbs, r)),
    [fResults, tid, tmdbs]
  );

  return results;
}
