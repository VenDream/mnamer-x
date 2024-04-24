import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import getFormattedFilename from '@/lib/formatter';
import { ProcessResult } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<ProcessResult>[] = [
  {
    header: 'No.',
    size: 50,
    cell({ row }) {
      return <p className="text-muted-foreground">{row.index + 1}</p>;
    },
  },
  {
    header: 'Input',
    cell({ row }) {
      const original = row.original.input;
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-2 break-all text-red-500 line-through">
                {original}
              </p>
            </TooltipTrigger>
            <TooltipContent>{original}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: 'Output',
    cell({ row }) {
      const formatted = getFormattedFilename(row.original);
      return (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="line-clamp-2 break-all text-green-500">
                {formatted}
              </p>
            </TooltipTrigger>
            <TooltipContent>{formatted}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: 'Action',
    size: 80,
    cell({ row }) {
      return 'todo';
    },
  },
];

export default columns;
