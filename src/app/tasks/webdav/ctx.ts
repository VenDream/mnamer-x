import { SelectResult } from '@/components/webdav-explorer';
import React, { useContext } from 'react';
import { FileStat } from 'webdav';

export interface WebDAVCtx {
  fileSource?: SelectResult;
  isSubmitting: boolean;
  removeItem: (stat: FileStat) => void;
}

export const WebDAVContext = React.createContext<WebDAVCtx | null>(null);

export function useWebDAVCtx() {
  return useContext(WebDAVContext) as WebDAVCtx;
}
