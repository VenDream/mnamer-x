import { Loading } from '@/components/ui/loading';
import {
  Table as ITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsDesktop } from '@/hooks/use-media-query';
import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePrevious } from 'ahooks';
import { useContext, useEffect, useState } from 'react';
import { FileStat } from 'webdav';
import { Breadcrumb } from './breadcrumb';
import { columns } from './columns';
import { WebDAVContext, WebDAVCtx } from './context';
import { Paginator } from './paginator';
import { Search } from './search';

const PAGE_SIZE = 5;
const DESKTOP_PAGE_SIZE = 10;

export function Table() {
  const ctx = useContext(WebDAVContext) as WebDAVCtx;
  const { props, isLoading, onItemClick, onRowSelectionChange } = ctx;
  const { mode, multiple, selected, accept } = props;
  const isDesktop = useIsDesktop();

  const [data, setData] = useState(ctx.data);
  const [rowSelection, setRowSelection] = useState(() => {
    const { dirs = [], files = [] } = selected || {};
    const selection: Record<string, boolean> = {};
    dirs.forEach(s => (selection[s.filename] = true));
    files.forEach(s => (selection[s.filename] = true));
    return selection;
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    lastmod: isDesktop,
  });

  const prevRowSelection = usePrevious(rowSelection);

  const isRowCanSelect = (row: Row<FileStat>) => {
    const { type, basename } = row.original;

    // type mismatch
    if (mode === 'directory' && type === 'file') return false;
    if (mode === 'file' && type === 'directory') return false;

    // format mismatch
    if (
      type === 'file' &&
      accept &&
      !accept.some(format => basename.endsWith(format))
    )
      return false;

    return true;
  };

  const table = useReactTable({
    data,
    columns,
    meta: { webdavCtx: ctx },
    state: { sorting, columnFilters, rowSelection, columnVisibility },
    enableRowSelection: isRowCanSelect,
    enableMultiRowSelection: !!multiple,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getRowId: row => row.filename,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(isDesktop ? DESKTOP_PAGE_SIZE : PAGE_SIZE);
  }, [isDesktop, table]);

  useEffect(() => {
    isLoading && setData([]);
  }, [isLoading, table]);

  useEffect(() => {
    ctx.data && setData(ctx.data);
  }, [ctx.data]);

  useEffect(() => {
    if (prevRowSelection !== undefined && rowSelection !== prevRowSelection) {
      onRowSelectionChange(rowSelection);
    }
  }, [onRowSelectionChange, prevRowSelection, rowSelection]);

  useEffect(() => {
    setColumnVisibility({ lastmod: isDesktop });
  }, [isDesktop]);

  return (
    <div className="p-1">
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
        <Breadcrumb
          historyPaths={ctx.historyPaths}
          onPathChange={ctx.onPathChange}
        />
        <Search table={table} currPath={ctx.currPath} />
      </div>
      <div className="border">
        <ITable>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="p-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loading className="justify-center" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer duration-100"
                  onClick={() => onItemClick(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id === 'select' ? 'p-0' : ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ITable>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Paginator table={table} />
      </div>
    </div>
  );
}
