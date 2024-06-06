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
import { SelectResult, WebDAVFs } from '@/components/webdav-fs';
import { WebDAVFsHandle } from '@/components/webdav-fs/webdav-fs';
import { CirclePlusIcon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function WebDAV() {
  const selectorRef = useRef<WebDAVFsHandle>(null);
  const [data, setData] = useState<SelectResult>();

  useEffect(() => {
    data && console.log(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>task input</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-2">
            <WebDAVFs
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
            </WebDAVFs>
            <DeleteConfirm
              title="Confirm to clear selection ?"
              onConfirm={() => {
                setData(undefined);
                selectorRef.current?.cleaerSelection();
                toast.success('Selection cleared');
              }}
            >
              <Button variant="outline">
                <XIcon size={16} className="mr-2" />
                Clear
              </Button>
            </DeleteConfirm>
          </div>
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
