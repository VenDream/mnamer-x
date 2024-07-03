'use client';

import { Loading } from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProcessTasks } from '@/hooks/use-process-tasks';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { cn, isDateBetween } from '@/lib/utils';
import { useStore } from '@/store';
import { TASK_TYPE, TMDBMovie, TMDBTv } from '@/types';
import dayjs from 'dayjs';
import { InfoIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { HistoryContext, HistoryCtx } from './context';
import { FloatMenu } from './float-menu';
import { Header } from './header';
import { Filter } from './task-filter';
import { TaskItem } from './task-item';

export default function History() {
  const tasks = useProcessTasks();
  const isHydrated = useStoreHydrate();
  const removeTask = useStore(state => state.removeTask);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState<Filter>({
    type: TASK_TYPE.ALL,
    keyword: '',
    range: {
      from: undefined,
      to: undefined,
    },
  });

  const filteredTasks = useMemo(() => {
    const { type, keyword, range } = filter;
    return tasks.filter(t => {
      const isTypeMatched = type === TASK_TYPE.ALL || t.type === type;
      const isKeywordMatched = keyword
        ? t.results.some(r => {
            const tmdb = r.output.tmdb;
            if (!tmdb) return false;
            const tLabel = dayjs(t.start).format('MMDDHHmm');
            const { title, original_title } = tmdb as TMDBMovie;
            const { name, original_name } = tmdb as TMDBTv;
            return [tLabel, title, original_title, name, original_name].some(
              s => s?.includes(keyword)
            );
          })
        : true;
      const isDateRangeMatched = range ? isDateBetween(t.start, range) : true;

      return isTypeMatched && isKeywordMatched && isDateRangeMatched;
    });
  }, [filter, tasks]);

  const selectAll = useCallback(() => {
    setSelected(filteredTasks.map(t => t.id));
  }, [filteredTasks]);

  const unselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  const removeTasks = useCallback(() => {
    selected.forEach(id => removeTask(id));
    toast.success(
      `${selected.length} ${selected.length > 1 ? 'tasks' : 'task'} deleted`
    );
    setSelected([]);
    setSelectMode(false);
  }, [removeTask, selected]);

  const toggleSelected = useCallback(
    (id: number) => {
      const idx = selected.findIndex(s => s === id);
      if (idx >= 0) {
        setSelected(selected.filter(s => s !== id));
      } else {
        setSelected([...selected, id]);
      }
    },
    [selected]
  );

  const toggleSelectMode = useCallback(() => {
    setSelectMode(mode => !mode);
  }, []);

  const ctx: HistoryCtx = useMemo(
    () => ({
      selected,
      selectMode,
      filter,
      setFilter,
      selectAll,
      unselectAll,
      removeTasks,
      toggleSelected,
      toggleSelectMode,
    }),
    [
      filter,
      removeTasks,
      selectAll,
      selectMode,
      selected,
      toggleSelectMode,
      toggleSelected,
      unselectAll,
    ]
  );

  useEffect(() => {
    selectMode === false && setSelected([]);
  }, [selectMode]);

  useEffect(() => {
    filter && setSelectMode(false);
  }, [filter]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <h1 className="text-xl">Task History</h1>
      {isHydrated ? (
        tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tasks have been performed yet.
          </p>
        ) : (
          <HistoryContext.Provider value={ctx}>
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <Header />
              <p className="flex items-center text-sm text-muted-foreground md:hidden">
                <InfoIcon size={16} className="mr-1" />
                Long press to select multiple tasks.
              </p>
              <div className="min-h-0 flex-1">
                <ScrollArea className="h-full pr-2 md:pr-4">
                  {filteredTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No tasks match the filter.
                    </p>
                  ) : (
                    <div
                      className={cn(
                        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
                        'xl:grid-cols-4 2xl:grid-cols-5'
                      )}
                    >
                      {filteredTasks.map(task => (
                        <TaskItem task={task} key={task.id} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
              <FloatMenu />
            </div>
          </HistoryContext.Provider>
        )
      ) : (
        <Loading text="Loading data..." />
      )}
    </div>
  );
}
