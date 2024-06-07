'use client';

import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  SelectResult,
  WebDAVExplorer,
  WebDAVExplorerHandle,
  getStatItemIcon,
} from '@/components/webdav-explorer';
import { cn } from '@/lib/utils';
import { produce } from 'immer';
import { CirclePlusIcon, CircleXIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileStat } from 'webdav';

export function WebDAV() {
  const selectorRef = useRef<WebDAVExplorerHandle>(null);
  const [data, setData] = useState<SelectResult>();

  const { dirs = [], files = [] } = data || {};
  const isEmpty = dirs.length === 0 && files.length === 0;

  const removeItem = useCallback((stat: FileStat) => {
    setData(data => {
      return produce(data, draft => {
        if (!draft) return;
        const list = draft[stat.type === 'directory' ? 'dirs' : 'files'];
        const idx = list.findIndex(s => s.filename === stat.filename);
        list.splice(idx, 1);
      });
    });
  }, []);

  useEffect(() => {
    data && console.log(data);
  }, [data]);

  const ItemList = useCallback(
    (props: { label: string; list: FileStat[] }) => {
      const { label, list } = props;
      if (list.length === 0) return null;

      return (
        <>
          <span className="col-span-1 flex h-8 items-center text-sm">
            {label}
          </span>
          <div className="col-span-9 flex flex-wrap gap-4">
            {list.map(item => {
              const Icon = getStatItemIcon(item);
              return (
                <Button
                  key={item.filename}
                  size="sm"
                  variant="outline"
                  title={item.basename}
                  className="group relative flex items-center"
                >
                  <Icon size={16} className="mr-1 shrink-0" />
                  <p className="line-clamp-1">{item.basename}</p>
                  <CircleXIcon
                    size={18}
                    onClick={() => removeItem(item)}
                    className={cn(
                      'absolute right-[-9px] top-[-9px] hidden',
                      'text-accent-foreground group-hover:block',
                      'hover:text-red-500'
                    )}
                  />
                </Button>
              );
            })}
          </div>
        </>
      );
    },
    [removeItem]
  );

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>task input</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <WebDAVExplorer
              mode="all"
              multiple={true}
              selected={data}
              onSelect={setData}
              ref={selectorRef}
            >
              <Button variant="outline">
                <CirclePlusIcon size={16} className="mr-2" />
                File Source
              </Button>
            </WebDAVExplorer>
            {!isEmpty && (
              <DeleteConfirm
                title="Confirm to clear all file sources ?"
                onConfirm={() => {
                  setData(undefined);
                  selectorRef.current?.cleaerSelection();
                  toast.success('All file sources cleared');
                }}
              >
                <Button variant="outline">
                  <XIcon size={16} className="mr-2" />
                  Clear
                </Button>
              </DeleteConfirm>
            )}
          </div>
          <Separator className="my-6" />
          {isEmpty ? (
            <p className="text-sm text-muted-foreground">No file source.</p>
          ) : (
            <div className="grid grid-cols-10 gap-4">
              <ItemList label="Dirs" list={dirs} />
              <ItemList label="Files" list={files} />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardDescription>task output</CardDescription>
        </CardHeader>
        <CardContent>output</CardContent>
      </Card>
    </div>
  );
}
