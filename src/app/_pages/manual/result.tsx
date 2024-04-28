import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProcessResult } from '@/types';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback } from 'react';
import { columns } from './result-columns';

interface IProps {
  result: ProcessResult[];
  updateResult: (idx: number, patch: Partial<ProcessResult>) => void;
}

export function Result(props: IProps) {
  const { result, updateResult } = props;

  const modifyOutput = useCallback(
    (idx: number, output: string) => {
      updateResult(idx, { modified: output });
    },
    [updateResult]
  );

  const table = useReactTable({
    data: result,
    columns,
    meta: { modifyOutput },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="border-r text-xs last:border-none last:text-center"
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="border-r text-xs last:border-none"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-xs"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
