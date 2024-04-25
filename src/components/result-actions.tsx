import { EditOutput } from '@/components/edit-output';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import getFormattedFilename from '@/lib/formatter';
import { copyText } from '@/lib/utils';
import { ProcessResult } from '@/types';
import {
  CopyIcon,
  DotsHorizontalIcon,
  IdCardIcon,
  Pencil2Icon,
} from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface IProps {
  row: Row<ProcessResult>;
}

export default function ResultActions(props: IProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isUnrecognized = !props.row.original.output.tmdb;
  const formatted = useMemo(
    () => getFormattedFilename(props.row.original),
    [props.row.original]
  );

  if (isUnrecognized) return <span className="block text-center">-</span>;

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
          onSave={modified => {
            console.log(modified);
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
