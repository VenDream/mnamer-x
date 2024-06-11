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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  SelectResult,
  WebDAVExplorer,
  WebDAVExplorerHandle,
  getStatItemIcon,
} from '@/components/webdav-explorer';
import { VIDEO_FILES } from '@/constants/file-types';
import { cn } from '@/lib/utils';
import { produce } from 'immer';
import { CirclePlusIcon, CircleXIcon, InfoIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    (props: { label: string; tips?: string; list: FileStat[] }) => {
      const { label, tips, list } = props;
      if (list.length === 0) return null;

      return (
        <>
          <div className="flex h-8 items-center text-sm">
            {label}
            {tips && (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <InfoIcon size={16} className="ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>{tips}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {list.map(item => {
              const Icon = getStatItemIcon(item);
              return (
                <Button
                  key={item.filename}
                  size="sm"
                  variant="outline"
                  title={item.basename}
                  className="group relative flex max-w-[180px] items-center"
                >
                  <Icon size={16} className="mr-1 shrink-0" />
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.basename}
                  </p>
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
              accept={VIDEO_FILES}
              resetTips="File sources cleared"
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
                  selectorRef.current?.cleaerSelection();
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
            <div className="grid grid-cols-[50px_1fr] gap-2 md:gap-4">
              <ItemList
                label="Dirs"
                list={dirs}
                tips="Automatically select video files within the directory (non-recursive)"
              />
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
