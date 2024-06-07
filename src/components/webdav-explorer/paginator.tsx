import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/table-core';
import { FileStat } from 'webdav';

interface IProps {
  table: Table<FileStat>;
}

export function Paginator(props: IProps) {
  const { table } = props;

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="select-none"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Prev
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="select-none"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
