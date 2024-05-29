import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as IBreadcrumb,
} from '@/components/ui/breadcrumb';
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
    <IBreadcrumb className="w-2/3">
      {showEllipsis ? (
        <BreadcrumbList className="flex-nowrap !gap-1">
          {first && (
            <>
              <BreadcrumbItem
                className="cursor-pointer"
                title={first.basename}
                onClick={() => onPathChange(first.filename, 0)}
              >
                <BreadcrumbPage>{first.basename}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="w-4" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
          {lastTwo.length >= 2 && (
            <>
              <BreadcrumbItem
                className="cursor-pointer"
                title={lastTwo[0].basename}
                onClick={() =>
                  onPathChange(lastTwo[0].filename, historyPaths.length - 2)
                }
              >
                <BreadcrumbPage className="line-clamp-1 break-all">
                  {lastTwo[0].basename}
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem title={lastTwo[1].basename}>
                <BreadcrumbPage className="line-clamp-1 break-all">
                  {lastTwo[1].basename}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
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
                  <BreadcrumbPage className="line-clamp-1 break-all">
                    {stat.basename}
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
