import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CircleCheckBigIcon,
  CircleIcon,
  CircleXIcon,
  Trash2Icon,
} from 'lucide-react';
import { useContext } from 'react';
import { HistoryContext, HistoryCtx } from './context';

export function FloatMenu() {
  const {
    selected,
    selectMode,
    selectAll,
    unselectAll,
    removeTasks,
    toggleSelectMode,
  } = useContext(HistoryContext) as HistoryCtx;

  return (
    <div
      className={cn(
        'invisible z-10 duration-200 fill-mode-forwards',
        'fixed bottom-8 left-[16.7%] flex h-10 w-2/3 items-center justify-center gap-2',
        'rounded bg-muted p-2 text-foreground shadow md:hidden',
        {
          visible: selectMode,
          'animate-in': selectMode,
          'slide-in-from-bottom-16': selectMode,
          'animate-out': !selectMode,
          'slide-out-to-bottom-16': !selectMode,
        }
      )}
    >
      <Button variant="ghost" className="h-8 w-8 p-1" onClick={selectAll}>
        <CircleCheckBigIcon size={18} className="!stroke-2 text-green-500" />
      </Button>
      <Button variant="ghost" className="h-8 w-8 p-1" onClick={unselectAll}>
        <CircleIcon size={18} className="!stroke-2 text-primary" />
      </Button>
      <DeleteConfirm onConfirm={removeTasks}>
        <Button
          variant="ghost"
          className="h-8 w-8 p-1"
          disabled={selected.length <= 0}
        >
          <Trash2Icon size={18} className="!stroke-2 text-red-500" />
        </Button>
      </DeleteConfirm>
      <Button
        variant="ghost"
        className="h-8 w-8 p-1"
        onClick={toggleSelectMode}
      >
        <CircleXIcon size={18} className="!stroke-2 text-muted-foreground" />
      </Button>
    </div>
  );
}
