import { UnderlineLink } from '@/components/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ROUTE } from '@/constants';
import { cn } from '@/lib/utils';
import { create as createWebDAVClient } from '@/lib/webdav-client';
import { useStore } from '@/store';
import { HardDriveIcon, InfoIcon, LinkIcon } from 'lucide-react';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FileStat, WebDAVClient } from 'webdav';
import { columns } from './columns';
import { DataTable } from './table';

interface SelectResult {
  dirs: FileStat[];
  files: FileStat[];
}

interface IProps extends PropsWithChildren<any> {
  clientId?: number;
  mode?: 'dir' | 'file' | 'all';
  multiple?: boolean;
  onSelect?: (result: SelectResult) => void;
}

export function WebDAVFs(props: IProps) {
  const { mode = 'all', multiple, clientId: cid, onSelect, children } = props;
  const webdavs = useStore(state => state.settings.webdav);
  const davServers = Object.values(webdavs);

  const [clientId, setClientId] = useState(cid);
  const [client, setClient] = useState<WebDAVClient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currPath, setCurrPath] = useState('/');
  const [currStats, setCurrStats] = useState<FileStat[]>([]);
  const [result, setResult] = useState<SelectResult>({
    dirs: [],
    files: [],
  });

  const initilize = useCallback(() => {
    if (!clientId) return;

    const clientOpts = webdavs[clientId];
    const client = createWebDAVClient(clientOpts);
    setClient(client);
  }, [clientId, webdavs]);

  const listDir = useCallback(async () => {
    if (!client) return;

    try {
      setIsLoading(true);
      const stats = await client.getDirectoryContents(currPath);
      console.log(stats);
      setCurrStats(stats as unknown as FileStat[]);
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to stat dir "${currPath}": ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [client, currPath]);

  const onItemClick = (stat: FileStat) => {
    console.log(stat);
  };

  const onItemSelectChanged = (selected: boolean, stat: FileStat) => {
    console.log(selected, stat);
  };

  useEffect(() => {
    initilize();
  }, [initilize]);

  useEffect(() => {
    if (!client) return;
    currPath && listDir();
  }, [client, currPath, listDir]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="h-[80vh] w-[90vw] max-w-[600px] md:h-[60vh] [&>*:first-child]:h-full [&>*:first-child]:min-h-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-left">WebDAV File Explorer</DialogTitle>
          <DialogDescription className="text-left">
            {clientId
              ? 'select/edit remote dirs and files.'
              : 'select a WebDAV server to browse.'}
          </DialogDescription>
          <div className="!mt-4 flex flex-1 flex-col overflow-auto">
            <ScrollArea>
              {clientId ? (
                <DataTable columns={columns} data={currStats} />
              ) : davServers.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 pb-2 pr-4">
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
                        <p
                          className="line-clamp-1 break-all"
                          title={server.name}
                        >
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
