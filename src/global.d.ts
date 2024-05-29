import ReactTable from '@tanstack/table-core';
import { WebDAVCtx } from './components/webdav-fs/context';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends ReactTable.RowData> {
    tid?: number;
    webdavCtx?: WebDAVCtx;
  }
}
