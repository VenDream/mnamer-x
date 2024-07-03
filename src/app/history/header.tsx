import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import {
  CircleCheckBigIcon,
  CircleIcon,
  SquareCheckBigIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { useContext } from 'react';
import { HistoryContext, HistoryCtx } from './context';
import { TaskFilter } from './task-filter';

export function Header() {
  const {
    selected,
    filter,
    setFilter,
    selectMode,
    selectAll,
    unselectAll,
    removeTasks,
    toggleSelectMode,
  } = useContext(HistoryContext) as HistoryCtx;

  const SelectBtnIcon = selectMode ? XIcon : SquareCheckBigIcon;

  return (
    <div className="hidden border-b pb-4 md:block">
      <TaskFilter filter={filter} onFilterChange={setFilter} />
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleSelectMode}>
            <SelectBtnIcon size={16} className="mr-2" />
            {selectMode ? 'Cancel' : 'Select'}
          </Button>
          {selectMode && (
            <Button variant="outline" onClick={selectAll}>
              <CircleCheckBigIcon size={16} className="mr-2" />
              Select All
            </Button>
          )}
          {selectMode && (
            <Button variant="outline" onClick={unselectAll}>
              <CircleIcon size={16} className="mr-2" />
              Unselect All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectMode && (
            <DeleteConfirm onConfirm={removeTasks}>
              <Button variant="destructive" disabled={selected.length <= 0}>
                <Trash2Icon size={16} className="mr-2" />
                Delete ({selected.length})
              </Button>
            </DeleteConfirm>
          )}
        </div>
      </div>
    </div>
  );
}
