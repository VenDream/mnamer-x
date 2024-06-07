import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as IBreadcrumb,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { FolderIcon } from 'lucide-react';
import { useMemo } from 'react';
import { FileStat } from 'webdav';

interface IProps {
  historyPaths: FileStat[];
  onPathChange: (path: string, idx: number) => void;
}

export function Breadcrumb(props: IProps) {
  const { historyPaths, onPathChange } = props;
  const showEllipsis = historyPaths.length >= 4;

  const { first, middle, lastTwo } = useMemo(() => {
    const first = historyPaths[0];
    const middle = historyPaths.slice(1, -2);
    const lastTwo = historyPaths.slice(-2);

    return { first, middle, lastTwo };
  }, [historyPaths]);

  return (
    <IBreadcrumb className="flex h-12 w-2/3 items-center">
      {showEllipsis ? (
        <BreadcrumbList className="!gap-1 break-all">
          <BreadcrumbItem
            className="cursor-pointer"
            title={first.basename}
            onClick={() => onPathChange(first.filename, 0)}
          >
            <BreadcrumbPage className="inline-flex items-center">
              <FolderIcon size={16} className="mr-2 shrink-0" />
              <p className="line-clamp-1 break-all">{first.basename}</p>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <BreadcrumbEllipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                className="w-auto"
                collisionPadding={20}
              >
                {middle.map((s, i) => (
                  <span
                    key={s.basename}
                    className={cn(
                      'flex cursor-pointer items-center rounded p-1 text-sm',
                      'transition-colors duration-100 hover:bg-accent'
                    )}
                    onClick={() => onPathChange(s.filename, i + 1)}
                  >
                    <FolderIcon size={16} className="mr-2" />
                    {s.basename}
                  </span>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem
            className="cursor-pointer"
            title={lastTwo[0].basename}
            onClick={() =>
              onPathChange(lastTwo[0].filename, historyPaths.length - 2)
            }
          >
            <BreadcrumbPage className="inline-flex items-center">
              <FolderIcon size={16} className="mr-2 shrink-0" />
              <p className="line-clamp-1 break-all">{lastTwo[0].basename}</p>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem title={lastTwo[1].basename}>
            <BreadcrumbPage className="inline-flex items-center">
              <FolderIcon size={16} className="mr-2 shrink-0" />
              <p className="line-clamp-1 break-all">{lastTwo[1].basename}</p>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      ) : (
        <BreadcrumbList className="flex-nowrap !gap-1">
          {historyPaths.map((stat, idx) => {
            const isLast = idx === historyPaths.length - 1;
            return (
              <div
                key={stat.basename}
                className="inline-flex items-center gap-1"
              >
                <BreadcrumbItem
                  key={stat.filename}
                  title={stat.basename}
                  className="cursor-pointer"
                  onClick={() => onPathChange(stat.filename, idx)}
                >
                  <BreadcrumbPage className="inline-flex items-center">
                    <FolderIcon size={16} className="mr-2 shrink-0" />
                    <p className="line-clamp-1 break-all">{stat.basename}</p>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      )}
    </IBreadcrumb>
  );
}
