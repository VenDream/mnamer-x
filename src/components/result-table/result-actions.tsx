import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFormattedFilename } from '@/lib/formatter';
import { copyText } from '@/lib/utils';
import { useStore } from '@/store';
import { ProcessResult } from '@/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row, Table } from '@tanstack/react-table';
import { CopyIcon, FilmIcon, SquarePenIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { EditOutput } from './edit-output';
import { TmdbInfo } from './tmdb-info';

interface IProps {
  row: Row<ProcessResult>;
  table: Table<ProcessResult>;
}

export function ResultActions(props: IProps) {
  const { table, row } = props;
  const result = row.original;
  const { tid } = table.options.meta!;
  const tmdbData = result.output.tmdb;
  const isUnrecognized = !tmdbData;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const updateTaskResult = useStore(state => state.updateTaskResult);
  const formatted = useMemo(() => getFormattedFilename(result), [result]);

  if (isUnrecognized) return <span className="block text-center">-</span>;

  return (
    <DropdownMenu modal={false} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="m-auto flex h-6 w-8 items-center justify-center p-1"
        >
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer text-sm"
          onClick={() => {
            copyText(formatted);
            toast.success('Copied to clipboard');
          }}
        >
          <CopyIcon size={14} className="mr-1" />
          Copy output
        </DropdownMenuItem>
        <EditOutput
          output={formatted}
          modified={result.modified}
          onSave={modified => {
            updateTaskResult(tid as number, row.index, { modified });
          }}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem
            className="cursor-pointer text-sm"
            onSelect={e => e.preventDefault()}
          >
            <SquarePenIcon size={14} className="mr-1" />
            Edit
          </DropdownMenuItem>
        </EditOutput>
        <TmdbInfo data={tmdbData} onClose={() => setIsMenuOpen(false)}>
          <DropdownMenuItem
            className="cursor-pointer text-sm"
            onSelect={e => e.preventDefault()}
          >
            <FilmIcon size={14} className="mr-1" />
            View TMDB info
          </DropdownMenuItem>
        </TmdbInfo>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
