import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toHumanReadableSize } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDownIcon } from 'lucide-react';
import { FileStat } from 'webdav';
import { getStatItemIcon } from './stat-icon';

export const columns: ColumnDef<FileStat>[] = [
  {
    id: 'select',
    size: 40,
    header: ({ table }) => {
      const { props } = table.options.meta?.webdavCtx || {};
      if (!props?.multiple) return null;

      return (
        <div className="flex h-full w-full items-center justify-center">
          <Checkbox
            aria-label="Select all"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          />
        </div>
      );
    },
    cell({ row }) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <Checkbox
            aria-label="Select row"
            disabled={!row.getCanSelect()}
            onClick={e => e.stopPropagation()}
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
          />
        </div>
      );
    },
  },
  {
    size: 250,
    accessorKey: 'basename',
    header({ column }) {
      return (
        <Button
          variant="ghost"
          className="flex h-full rounded-none p-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDownIcon size={16} className="ml-1" />
        </Button>
      );
    },
    cell({ row }) {
      const { basename } = row.original;
      const Icon = getStatItemIcon(row.original);

      return (
        <div className="flex items-center">
          <Icon size={16} className="mr-1 shrink-0" />
          <p className="line-clamp-1 break-all" title={basename}>
            {basename}
          </p>
        </div>
      );
    },
  },
  {
    size: 140,
    accessorKey: 'size',
    header({ column }) {
      return (
        <Button
          variant="ghost"
          className="flex h-full rounded-none p-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Size
          <ArrowUpDownIcon size={16} className="ml-2" />
        </Button>
      );
    },
    cell({ row }) {
      const { type, size } = row.original;
      const sizeStr = toHumanReadableSize(size);
      return type === 'file' ? sizeStr : '-';
    },
  },
  {
    size: 130,
    accessorKey: 'lastmod',
    header({ column }) {
      return (
        <Button
          variant="ghost"
          className="flex h-full rounded-none p-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Modified
          <ArrowUpDownIcon size={16} className="ml-2" />
        </Button>
      );
    },
    cell({ row }) {
      const { lastmod } = row.original;
      return format(lastmod, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
