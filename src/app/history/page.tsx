'use client';

import { ContentPage } from '@/components/ui/content-page';
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
import { FloatFilter } from './float-filter';
import { FloatMenu } from './float-menu';
import { Header } from './header';
import { DEFAULT_FILTER } from './task-filter';
import { TaskItem } from './task-item';

export default function History() {
  const tasks = useProcessTasks();
  const isHydrated = useStoreHydrate();
  const removeTask = useStore(state => state.removeTask);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  const [animate, setAnimate] = useState(true);
  const [showFloatFilter, setShowFloatFilter] = useState(false);

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
    <ContentPage
      fullWidth
      animate={animate}
      onAnimationEnd={() => {
        setAnimate(false);
        setShowFloatFilter(true);
      }}
      className="flex h-[calc(100vh-4rem)] flex-col gap-4 fill-mode-backwards"
    >
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
                        <TaskItem tid={task.id} key={task.id} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
              <FloatMenu />
              {showFloatFilter && <FloatFilter />}
            </div>
          </HistoryContext.Provider>
        )
      ) : (
        <Loading text="Loading data..." />
      )}
    </ContentPage>
  );
}
