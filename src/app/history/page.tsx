'use client';

import { TaskCard } from '@/components/task-card';
import { Loading } from '@/components/ui/loading';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { useStore } from '@/store';

export default function History() {
  const isHydrated = useStoreHydrate();
  const tasks = useStore(state => Object.values(state.tasks));

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl">Task History</h1>
      {isHydrated ? (
        <div className="flex w-full flex-col gap-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks have been performed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tasks.map((task, idx) => (
                <TaskCard key={task.id} tid={task.id} idx={idx + 1}></TaskCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Loading text="Loading data..."></Loading>
      )}
    </div>
  );
}
