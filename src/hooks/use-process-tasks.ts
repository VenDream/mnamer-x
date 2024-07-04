import { useStore } from '@/store';
import { structuralizeProcessTask } from '@/store/transformer';
import { ProcessTask } from '@/types';

export function useProcessTasks() {
  const tmdbs = useStore(state => state.tmdbs);
  const tasks = useStore(state =>
    Object.values(state.tasks)
      .sort((t1, t2) => t2.id - t1.id)
      .map(t => structuralizeProcessTask(tmdbs, t))
  );
  return tasks;
}

export function useProcessTask(tid: number) {
  const tasks = useProcessTasks();
  const task = tasks.find(t => t.id === tid);
  return task as ProcessTask;
}
