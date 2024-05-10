import ReactTable from '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends ReactTable.RowData> {
    tid: number;
    modifyOutput: (id: number, idx: number, output: string) => void;
  }
}
