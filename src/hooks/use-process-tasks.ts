import { useStore } from '@/store';
import { structuralizeProcessTask } from '@/store/transformer';

export function useProcessTasks() {
  const tmdbs = useStore(state => state.tmdbs);
  const tasks = useStore(state =>
    Object.values(state.tasks)
      .sort((t1, t2) => t2.id - t1.id)
      .map(t => structuralizeProcessTask(tmdbs, t))
  );
  return tasks;
}
