import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toHumanReadableSize } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ArrowUpDownIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon,
} from 'lucide-react';
import { FileStat } from 'webdav';

const ARCHIVE_FILES = [
  '.zip',
  '.7z',
  '.rar',
  '.tar',
  '.gz',
  '.bz2',
  '.xz',
  '.var',
];

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
          <ArrowUpDownIcon size={16} className="ml-2" />
        </Button>
      );
    },
    cell({ row }) {
      const { mime, type, basename } = row.original;
      let Icon = type === 'directory' ? FolderIcon : FileIcon;

      if (mime?.includes('image')) Icon = FileImageIcon;
      if (mime?.includes('video')) Icon = FileVideoIcon;
      if (mime?.includes('audio')) Icon = FileAudioIcon;
      if (basename.endsWith('.txt')) Icon = FileTextIcon;
      if (ARCHIVE_FILES.some(format => basename.toLowerCase().endsWith(format)))
        Icon = FileArchiveIcon;

      return (
        <div className="flex items-center">
          <Icon size={16} className="mr-2 shrink-0" />
          <p className="line-clamp-1 break-all" title={basename}>
            {basename}
          </p>
        </div>
      );
    },
  },
  {
    size: 100,
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
    size: 180,
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
