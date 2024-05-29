'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SelectResult, WebDAVFs } from '@/components/webdav-fs';
import { CirclePlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WebDAV() {
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
          <WebDAVFs selected={data} onSelect={setData}>
            <Button variant="outline">
              <CirclePlusIcon size={16} className="mr-2"></CirclePlusIcon>
              File Source
            </Button>
          </WebDAVFs>
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
