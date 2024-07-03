import { cn } from '@/lib/utils';
import { ProcessTask } from '@/types';
import { useLongPress } from 'ahooks';
import { CircleCheckBigIcon, CircleIcon } from 'lucide-react';
import { useContext, useRef } from 'react';
import { HistoryContext, HistoryCtx } from './context';
import { TaskCard } from './task-card';

interface IProps {
  task: ProcessTask;
}

export function TaskItem(props: IProps) {
  const { task } = props;
  const { selectMode, toggleSelectMode, selected, toggleSelected } = useContext(
    HistoryContext
  ) as HistoryCtx;

  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selected.includes(task.id);
  const Icon = isSelected ? CircleCheckBigIcon : CircleIcon;

  useLongPress(
    () => {
      if (!selectMode) {
        toggleSelectMode();
        toggleSelected(task.id);
      }
    },
    ref,
    {
      onClick: () => {
        selectMode && toggleSelected(task.id);
      },
      onLongPressEnd: evt => {
        evt.preventDefault();
      },
    }
  );

  return (
    <div className="p-2 md:p-1">
      <div
        ref={ref}
        className={cn(
          'relative cursor-pointer rounded after:absolute',
          'outline outline-0 outline-primary after:rounded',
          'after:bg-accent/20',
          {
            'after:inset-0': selectMode,
            'after:bg-accent/60': isSelected,
            'outline-2': isSelected,
          }
        )}
      >
        <TaskCard tid={task.id} />
        {selectMode && (
          <Icon
            size={22}
            strokeWidth={3}
            className="absolute right-[18px] top-[24px] z-10 !stroke-2 text-primary"
          />
        )}
      </div>
    </div>
  );
}
