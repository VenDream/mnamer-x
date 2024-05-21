import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getFormattedFilename } from '@/lib/formatter';
import { cn, zeroPad } from '@/lib/utils';
import { ProcessResult } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ResultActions } from './result-actions';

const columns: ColumnDef<ProcessResult>[] = [
  {
    header: 'No.',
    size: 30,
    cell({ row }) {
      return (
        <p className="text-muted-foreground">{zeroPad(row.index + 1, 2)}</p>
      );
    },
  },
  {
    header: 'Input',
    size: 250,
    cell({ row }) {
      const isUnrecognized = !row.original.output.tmdb;
      const original = row.original.input;
      const color = isUnrecognized
        ? 'text-muted-foreground'
        : 'text-red-500 line-through';
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className={cn('line-clamp-2 break-all', color)}>{original}</p>
            </TooltipTrigger>
            <TooltipContent>{original}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: 'Output',
    size: 250,
    cell({ row }) {
      const { output, modified } = row.original;
      const isUnrecognized = !output.tmdb;
      const formatted = modified || getFormattedFilename(row.original);
      const color = isUnrecognized ? 'text-muted-foreground' : 'text-green-500';

      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className={cn('line-clamp-2 break-all', color)}>{formatted}</p>
            </TooltipTrigger>
            <TooltipContent>{formatted}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: 'Action',
    size: 50,
    cell({ table, row }) {
      return <ResultActions row={row} table={table}></ResultActions>;
    },
  },
];

export { columns };
