'use client';

import { useStore } from '@/store';
import { structuralizeProcessTask } from '@/store/transformer';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Result } from '../_pages/manual/result';

export default function History() {
  const [isHydrated, setIsHydrated] = useState(false);

  const tmdbs = useStore(state => state.tmdbs);
  const fTasks = useStore(state => Object.values(state.tasks));
  const updateTaskResult = useStore(state => state.updateTaskResult);
  const tasks = useMemo(
    () => fTasks.map(t => structuralizeProcessTask(tmdbs, t)),
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
            tasks.map((task, tidx) => (
              <Result
                key={tidx}
                tid={task.id}
                result={task.results}
                updateResult={updateTaskResult}
              />
            ))
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
