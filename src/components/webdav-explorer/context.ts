import React from 'react';
import { FileStat } from 'webdav';
import { IProps } from './webdav-explorer';

export interface WebDAVCtx {
  props: IProps;
  currPath: string;
  data: FileStat[];
  isLoading: boolean;
  historyPaths: FileStat[];
  onItemClick: (stat: FileStat) => void;
  onPathChange: (path: string, historyPathsIdx: number) => void;
  onRowSelectionChange: (selection: Record<string, boolean>) => void;
}

export const WebDAVContext = React.createContext<WebDAVCtx | null>(null);
