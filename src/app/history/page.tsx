'use client';

import { useStore } from '@/store';
import { LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Result } from '../_pages/manual/result';

export default function History() {
  const [isHydrated, setIsHydrated] = useState(false);
  const tasks = useStore(state => state.history);
  const updateTaskResult = useStore(state => state.updateTaskResult);

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
                result={task.results}
                updateResult={(ridx, patch) => {
                  updateTaskResult(tidx, ridx, patch);
                }}
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
