import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/table-core';
import { SearchIcon } from 'lucide-react';
import { useEffect } from 'react';
import { FileStat } from 'webdav';

interface IProps {
  table: Table<FileStat>;
  currPath: string;
}

export function Search(props: IProps) {
  const { table, currPath } = props;
  const statName = table.getColumn('basename');

  useEffect(() => {
    currPath && statName?.setFilterValue('');
  }, [currPath, statName]);

  return (
    <div className="relative w-1/3">
      <SearchIcon
        size={16}
        className="absolute left-2.5 top-2.5 text-muted-foreground"
      />
      <Input
        placeholder="Search"
        className="pl-8"
        value={(statName?.getFilterValue() as string) ?? ''}
        onChange={e => statName?.setFilterValue(e.target.value)}
      />
    </div>
  );
}
