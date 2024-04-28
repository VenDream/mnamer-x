import { EditOutput } from '@/components/edit-output';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFormattedFilename } from '@/lib/formatter';
import { copyText } from '@/lib/utils';
import { ProcessResult } from '@/types';
import {
  CopyIcon,
  DotsHorizontalIcon,
  IdCardIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons';
import { Row, Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface IProps {
  row: Row<ProcessResult>;
  table: Table<ProcessResult>;
}

export function ResultActions(props: IProps) {
  const { table, row } = props;
  const result = row.original;
  const { modifyOutput } = table.options.meta!;
  const isUnrecognized = !result.output.tmdb;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formatted = useMemo(() => getFormattedFilename(result), [result]);

  if (isUnrecognized) return <span className="block text-center">-</span>;

  return (
    <DropdownMenu modal={false} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="m-auto flex h-6 w-8 items-center justify-center p-1"
        >
          <DotsHorizontalIcon></DotsHorizontalIcon>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={() => {
            copyText(formatted);
            toast.success('Copied to clipboard');
          }}
        >
          <CopyIcon className="mr-1"></CopyIcon>
          Copy output
        </DropdownMenuItem>
        <EditOutput
          output={formatted}
          modified={result.modified}
          onSave={modified => {
            modifyOutput(row.index, modified);
          }}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onSelect={e => e.preventDefault()}
          >
            <Pencil2Icon className="mr-1"></Pencil2Icon>
            Edit
          </DropdownMenuItem>
        </EditOutput>
        <DropdownMenuItem className="cursor-pointer text-xs">
          <IdCardIcon className="mr-1"></IdCardIcon>
          View TMDB meta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
