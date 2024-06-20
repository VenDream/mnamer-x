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
import { TASK_TYPE } from '@/types';
import { useDebounceFn } from 'ahooks';
import { format } from 'date-fns';
import { CalendarDaysIcon, SearchIcon } from 'lucide-react';
import { useMemo } from 'react';
import { DateRange } from 'react-day-picker';

export interface Filter {
  type: TASK_TYPE;
  keyword: string;
  range: DateRange;
}

interface IProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export function TaskFilter(props: IProps) {
  const { filter, onFilterChange } = props;

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
    onFilterChange({ ...filter, ...patch });
  };

  const { run: debouncedUpdateFilter } = useDebounceFn(updateFilter, {
    wait: 100,
  });

  return (
    <div className="grid grid-cols-1 grid-rows-3 gap-2 md:grid-cols-4 md:grid-rows-1">
      <div className="row-span-1 md:col-span-1">
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
      <div className="row-span-1 md:col-span-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="group w-full min-w-[250px] justify-start gap-2 text-muted-foreground"
            >
              <CalendarDaysIcon
                size={16}
                className="text-muted-foreground transition-colors group-hover:text-accent-foreground"
              />
              {dateLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={filter.range}
              numberOfMonths={2}
              defaultMonth={filter.range?.from || new Date()}
              onSelect={range => updateFilter({ range })}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative row-span-1 md:col-span-1 md:col-start-4">
        <SearchIcon
          size={16}
          className="absolute left-2.5 top-2.5 text-muted-foreground"
        />
        <Input
          placeholder="Keyword"
          defaultValue={filter.keyword}
          className="pl-8"
          onChange={e =>
            debouncedUpdateFilter({ keyword: e.currentTarget.value })
          }
        />
      </div>
    </div>
  );
}
