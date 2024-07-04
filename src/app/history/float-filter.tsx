import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { TASK_TYPE } from '@/types';
import { format } from 'date-fns';
import {
  CalendarDaysIcon,
  FilterIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
} from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { HistoryContext, HistoryCtx } from './context';
import { DEFAULT_FILTER, Filter } from './task-filter';

export function FloatFilter() {
  const { filter: ctxFilter, setFilter: setCtxFilter } = useContext(
    HistoryContext
  ) as HistoryCtx;

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(ctxFilter);

  const dateLabel = useMemo(() => {
    const { from, to } = filter.range || {};
    if (from) {
      const fromStr = format(from, 'yyyy/MM/dd');
      if (to) {
        const toStr = format(to, 'yyyy/MM/dd');
        return `${fromStr} - ${toStr}`;
      }
      return fromStr;
    }
    return 'Pick a date (range)';
  }, [filter.range]);

  const updateFilter = (patch: Partial<Filter>) => {
    setFilter({ ...filter, ...patch });
  };

  const applyFilter = () => {
    setCtxFilter(filter);
    setOpen(false);
  };

  const resetFilter = () => {
    setFilter(DEFAULT_FILTER);
    setCtxFilter(DEFAULT_FILTER);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'fixed right-[-8px] top-[76px] z-10 block md:hidden',
            'animate-in slide-in-from-right animate-duration-[600ms]'
          )}
        >
          <FilterIcon size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-5/6 sm:max-w-md"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="">Type</label>
            <Select
              value={filter.type}
              onValueChange={type => updateFilter({ type: type as TASK_TYPE })}
            >
              <SelectTrigger>
                <SelectValue placeholder={TASK_TYPE.ALL} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TASK_TYPE).map(type => (
                  <SelectItem key={type} value={type}>
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="group w-full justify-start gap-2 text-muted-foreground"
                >
                  <CalendarDaysIcon
                    size={16}
                    className="text-muted-foreground transition-colors group-hover:text-accent-foreground"
                  />
                  {dateLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                avoidCollisions
              >
                <Calendar
                  initialFocus
                  mode="range"
                  selected={filter.range}
                  numberOfMonths={1}
                  defaultMonth={filter.range?.from || new Date()}
                  onSelect={range => updateFilter({ range })}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label htmlFor="">Keyword</label>
            <div className="relative">
              <SearchIcon
                size={16}
                className="absolute left-2.5 top-2.5 text-muted-foreground"
              />
              <Input
                placeholder="Keyword"
                defaultValue={filter.keyword}
                className="pl-8"
                onChange={e => updateFilter({ keyword: e.currentTarget.value })}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button type="submit" variant="outline" onClick={resetFilter}>
            <RotateCcwIcon size={16} className="mr-2" />
            Reset
          </Button>
          <Button type="submit" variant="outline" onClick={applyFilter}>
            <SaveIcon size={16} className="mr-2" />
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
