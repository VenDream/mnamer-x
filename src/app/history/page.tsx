'use client';

import { TaskCard } from '@/components/task-card';
import { useStore } from '@/store';
import { structuralizeProcessTask } from '@/store/transformer';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function History() {
  const [isHydrated, setIsHydrated] = useState(false);

  const tmdbs = useStore(state => state.tmdbs);
  const fTasks = useStore(state => Object.values(state.tasks));
  const tasks = useMemo(
    () =>
      fTasks
        .map(t => structuralizeProcessTask(tmdbs, t))
        .sort((a, b) => b.id - a.id),
    [fTasks, tmdbs]
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl">Task History</h1>
      {isHydrated ? (
        <div className="flex w-full flex-col gap-4 md:max-w-screen-lg">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks have been performed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, idx) => (
                <TaskCard key={task.id} tid={task.id} idx={idx + 1}></TaskCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="flex items-center gap-2">
          <LoaderIcon size={15} className="animate-spin"></LoaderIcon>
          Loading data...
        </span>
      )}
    </div>
  );
}
