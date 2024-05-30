import { UnderlineLink } from '@/components/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ROUTE } from '@/constants';
import { cn } from '@/lib/utils';
import { create as createWebDAVClient } from '@/lib/webdav-client';
import { useStore } from '@/store';
import cloneDeep from 'lodash.clonedeep';
import { HardDriveIcon, InfoIcon, LinkIcon } from 'lucide-react';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { FileStat, WebDAVClient } from 'webdav';
import { WebDAVContext, WebDAVCtx } from './context';
import { Table } from './table';

export interface SelectResult {
  clientId: number;
  dirs: FileStat[];
  files: FileStat[];
}

export interface IProps extends PropsWithChildren<any> {
  selected?: SelectResult;
  mode?: 'dirs' | 'files' | 'all';
  multiple?: boolean;
  onSelect?: (result: SelectResult) => void;
}

const defaultProps: IProps = {
  mode: 'all',
  multiple: true,
};

export function WebDAVFs(props: IProps) {
  const finalProps = useMemo(() => ({ ...defaultProps, ...props }), [props]);
  const { multiple, selected, onSelect } = finalProps;
  const webdavs = useStore(state => state.settings.webdav);
  const davServers = Object.values(webdavs);

  const [clientId, setClientId] = useState(selected?.clientId || -1);
  const [client, setClient] = useState<WebDAVClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currPath, setCurrPath] = useState('/');
  const [historyPaths, setHistoryPaths] = useState<FileStat[]>([]);
  const [currStats, setCurrStats] = useState<FileStat[]>([]);
  const [result, setResult] = useState<SelectResult>(
    selected || {
      clientId,
      dirs: [],
      files: [],
    }
  );

  const initilize = useCallback(() => {
    if (clientId < 0) return;

    const clientOpts = webdavs[clientId];
    const client = createWebDAVClient(clientOpts);
    setClient(client);
    setResult(result => ({ ...result, clientId }));
    setHistoryPaths([
      {
        filename: '/',
        basename: clientOpts.name,
        size: 0,
        etag: '',
        lastmod: '',
        type: 'directory',
      },
    ]);
  }, [clientId, webdavs]);

  const listDir = useCallback(async () => {
    if (!client) return;

    try {
      setIsLoading(true);
      const stats = await client.getDirectoryContents(currPath);
      setCurrStats(stats as unknown as FileStat[]);
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to stat dir "${currPath}": ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [client, currPath]);

  const onItemClick = useCallback((stat: FileStat) => {
    const { type } = stat;

    if (type === 'directory') {
      setCurrPath(stat.filename);
      setHistoryPaths(prev => [...prev, stat]);
    }

    if (type === 'file') {
      // @TODO previewer
      console.log(stat);
    }
  }, []);

  const onRowSelectionChange = useCallback(
    (selection: Record<string, boolean>) => {
      setResult(result => {
        const selectedKeys = Object.keys(selection);
        const newResult = cloneDeep(result);
        !multiple && (newResult.dirs = []);
        !multiple && (newResult.files = []);
        const { dirs = [], files = [] } = newResult;
        const stats = currStats.filter(s => s.filename.startsWith(currPath));

        stats.forEach(stat => {
          const { filename } = stat;
          const isSelected = selectedKeys.includes(filename);
          if (isSelected) {
            const isDir = stat.type === 'directory';
            isDir && !isContainsStat(dirs, stat) && dirs.push(stat);
            !isDir && !isContainsStat(files, stat) && files.push(stat);
          } else {
            const dIdx = dirs.findIndex(s => s.filename === filename);
            const fIdx = files.findIndex(s => s.filename === filename);
            dIdx >= 0 && dirs.splice(dIdx, 1);
            fIdx >= 0 && files.splice(fIdx, 1);
          }
        });

        return newResult;
      });
    },
    [currPath, currStats, multiple]
  );

  const onPathChange = useCallback((path: string, historyPathsIdx: number) => {
    setCurrPath(path);
    setHistoryPaths(prev => prev.slice(0, historyPathsIdx + 1));
  }, []);

  const ctx: WebDAVCtx = useMemo(
    () => ({
      props: finalProps,
      data: currStats,
      currPath,
      isLoading,
      historyPaths,
      onItemClick,
      onPathChange,
      onRowSelectionChange,
    }),
    [
      currPath,
      currStats,
      finalProps,
      historyPaths,
      isLoading,
      onItemClick,
      onPathChange,
      onRowSelectionChange,
    ]
  );

  useEffect(() => {
    initilize();
  }, [initilize]);

  useEffect(() => {
    if (!client) return;
    currPath && listDir();
  }, [client, currPath, listDir]);

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className="flex h-[80vh] w-[90vw] max-w-[600px] flex-col md:h-[65vh] md:min-h-[700px]"
        onOpenAutoFocus={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="px-1 text-left">
            WebDAV File Explorer
          </DialogTitle>
          <DialogDescription className="px-1 text-left">
            {client
              ? 'select/edit remote dirs and files.'
              : 'select a WebDAV server to explore.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-auto">
          <ScrollArea>
            {client ? (
              <WebDAVContext.Provider value={ctx}>
                <Table />
              </WebDAVContext.Provider>
            ) : davServers.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 pb-2 pl-1 pr-4">
                {davServers.map(server => (
                  <div
                    key={server.id}
                    onClick={() => setClientId(server.id)}
                    className={cn(
                      'flex cursor-pointer flex-col space-y-1 rounded border px-4 py-2',
                      'shadow transition-colors duration-150 hover:bg-accent'
                    )}
                  >
                    <div className="flex items-center">
                      <HardDriveIcon size={16} className="mr-2 shrink-0" />
                      <p className="line-clamp-1 break-all" title={server.name}>
                        {server.name}
                      </p>
                    </div>
                    <div className="hidden h-[2.5em]  text-xs text-muted-foreground md:flex">
                      <LinkIcon
                        size={12}
                        className="relative top-[2px] mr-3 shrink-0"
                      />
                      <p
                        className="line-clamp-2 break-all"
                        title={server.remoteURL}
                      >
                        {server.remoteURL}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <InfoIcon size={16}></InfoIcon>
                No WebDAV servers have been added yet. Add one in{' '}
                <UnderlineLink href={ROUTE.SETTINGS}>settings.</UnderlineLink>
              </p>
            )}
          </ScrollArea>
        </div>
        {client && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={() => onSelect?.(result)}>
                Select
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function isContainsStat(arr: FileStat[], stat: FileStat) {
  return arr.findIndex(s => s.filename === stat.filename) >= 0;
}
