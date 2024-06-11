import ReactTable from '@tanstack/table-core';
import { WebDAVCtx } from './components/webdav-explorer/context';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends ReactTable.RowData> {
    tid?: number;
    webdavCtx?: WebDAVCtx;
  }
}

declare module 'react' {
  declare function IForwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => ReactElement | null
  ): (props: P & React.RefAttributes<T>) => ReactElement | null;
}
