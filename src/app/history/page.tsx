'use client';

import { TaskCard } from '@/components/task-card';
import { Filter, TaskFilter } from '@/components/task-filter';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Loading } from '@/components/ui/loading';
import { useProcessTasks } from '@/hooks/use-process-tasks';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { isDateBetween } from '@/lib/utils';
import { TASK_TYPE, TMDBMovie, TMDBTv } from '@/types';
import { FilterIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function History() {
  const tasks = useProcessTasks();
  const isHydrated = useStoreHydrate();

  const [filter, setFilter] = useState<Filter>({
    type: TASK_TYPE.MANUAL,
    keyword: '',
    range: {
      from: undefined,
      to: undefined,
    },
  });

  const filteredTasks = useMemo(() => {
    const { type, keyword, range } = filter;
    return tasks.filter(t => {
      const isTypeMatched = t.type === type;
      const isKeywordMatched = keyword
        ? t.results.some(r => {
            const tmdb = r.output.tmdb;
            if (!tmdb) return false;
            const { title, original_title } = tmdb as TMDBMovie;
            const { name, original_name } = tmdb as TMDBTv;
            return [title, original_title, name, original_name].some(s =>
              s?.includes(keyword)
            );
          })
        : true;
      const isDateRangeMatched = range ? isDateBetween(t.start, range) : true;

      return isTypeMatched && isKeywordMatched && isDateRangeMatched;
    });
  }, [filter, tasks]);

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
            <div>
              <Collapsible className="space-y-2 md:hidden">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FilterIcon size={16} />
                    Filter
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <TaskFilter
                    filter={filter}
                    onFilterChange={setFilter}
                  ></TaskFilter>
                </CollapsibleContent>
              </Collapsible>
              <div className="hidden md:block">
                <TaskFilter
                  filter={filter}
                  onFilterChange={setFilter}
                ></TaskFilter>
              </div>
              {filteredTasks.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">
                  No tasks match the filter.
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredTasks.map((task, idx) => (
                    <TaskCard
                      key={task.id}
                      tid={task.id}
                      idx={idx + 1}
                    ></TaskCard>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Loading text="Loading data..."></Loading>
      )}
    </div>
  );
}
