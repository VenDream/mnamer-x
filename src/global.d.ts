import ReactTable from '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends ReactTable.RowData> {
    modifyOutput: (idx: number, output: string) => void;
  }
}
