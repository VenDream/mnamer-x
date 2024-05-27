import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FileIcon, FolderIcon } from 'lucide-react';
import { FileStat } from 'webdav';

export const columns: ColumnDef<FileStat>[] = [
  {
    size: 500,
    header: 'Name',
    cell({ row }) {
      const { type, filename } = row.original;
      const Icon = type === 'directory' ? FolderIcon : FileIcon;
      return (
        <div className="flex items-center">
          <Icon size={16} className="mr-2" />
          <p className="line-clamp-1">{filename}</p>
        </div>
      );
    },
  },
  {
    header: 'Size',
    cell({ row }) {
      const { type, size } = row.original;
      return type === 'file' ? size : '-';
    },
  },
  {
    header: 'Modified',
    cell({ row }) {
      const { lastmod } = row.original;
      return format(lastmod, 'yyyy-MM-dd HH:mm:ss');
    },
  },
];
