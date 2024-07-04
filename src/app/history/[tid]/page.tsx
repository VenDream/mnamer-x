'use client';

import { UnderlineLink } from '@/components/link';
import { ResultTable } from '@/components/result-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentPage } from '@/components/ui/content-page';
import { Loading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { ROUTE } from '@/constants';
import { useProcessResults } from '@/hooks/use-process-results';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { useStore } from '@/store';
import {
  BotIcon,
  CircleCheckIcon,
  CircleXIcon,
  Clock3Icon,
  Clock4Icon,
  FileIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function TaskDetail({ params }: { params: { tid: string } }) {
  const tid = +params.tid;
  const task = useStore(state => state.tasks[tid]);
  const results = useProcessResults(tid);
  const isHydrated = useStoreHydrate();

  const total = task?.results.length || 0;
  const success = task?.results.filter(t => t.output.tmdbid > 0).length || 0;
  const fail = total - success;

  return (
    <ContentPage className="space-y-4">
      <h1 className="mb-4 text-xl">Task Detail</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={ROUTE.HISTORY}>History</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{params.tid}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Separator className="my-4" />
      {isHydrated ? (
        !!task ? (
          <div className="space-y-6">
            <Card className="md:w-2/3">
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <span className="flex items-center gap-2 text-sm">
                    <BotIcon size={16} className="relative -top-[1px]" />
                    <span className="w-16 text-right">type：</span>
                    <span>{task.type}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <FileIcon size={16} className="relative -top-[1px]" />
                    <span className="w-16 text-right">total：</span>
                    {total}
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <CircleCheckIcon
                      size={16}
                      className="relative -top-[1px]"
                    />
                    <span className="w-16 text-right">success：</span>
                    <span className="text-green-500">{success}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <CircleXIcon size={16} className="relative -top-[1px]" />
                    <span className="w-16 text-right">failed：</span>
                    <span className="text-red-500">{fail}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Clock3Icon size={16} className="relative -top-[1px]" />
                    <span className="w-16 text-right">start at：</span>
                    <span>{task.start}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Clock4Icon size={16} className="relative -top-[1px]" />
                    <span className="w-16 text-right">end at：</span>
                    <span>{task.end}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultTable tid={tid} results={results} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-sm text-muted-foreground">Task not found.</p>
            <UnderlineLink
              href={ROUTE.HISTORY}
              className="text-sm text-muted-foreground"
            >
              Go back.
            </UnderlineLink>
          </div>
        )
      ) : (
        <Loading text="Loading data..." />
      )}
    </ContentPage>
  );
}
