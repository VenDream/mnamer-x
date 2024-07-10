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
import { FolderIcon, HardDriveIcon } from 'lucide-react';
import { useMemo } from 'react';
import { FileStat } from 'webdav';

interface IProps {
  historyPaths: FileStat[];
  onPathChange: (path: string, idx: number) => void;
}

export function Breadcrumb(props: IProps) {
  const { historyPaths, onPathChange } = props;
  const showEllipsis = historyPaths.length >= 5;

  const { items, ellipsis } = useMemo(() => {
    if (!showEllipsis) return { items: historyPaths, ellipsis: [] };

    const firstTwo = historyPaths.slice(0, 2);
    const ellipsis = historyPaths.slice(2, -2);
    const middle: FileStat = {
      filename: '',
      basename: 'ellipsis',
      size: 0,
      etag: '',
      lastmod: '',
      type: 'directory',
    };
    const lastTwo = historyPaths.slice(-2);
    const items = [...firstTwo, middle, ...lastTwo];

    return { items, ellipsis };
  }, [historyPaths, showEllipsis]);

  const getOriginalIdx = (item: FileStat) => {
    return historyPaths.findIndex(i => i.filename === item.filename);
  };

  return (
    <IBreadcrumb className="flex items-center md:h-12 md:w-2/3">
      <BreadcrumbList className="!gap-1">
        {items.map((stat, idx) => {
          const oIdx = getOriginalIdx(stat);
          const isLast = idx === items.length - 1;
          const Icon = idx === 0 ? HardDriveIcon : FolderIcon;
          const isEllipsis = stat.basename === 'ellipsis';

          return (
            <div key={stat.basename} className="inline-flex items-center gap-1">
              <BreadcrumbItem
                key={stat.filename}
                title={stat.basename}
                className="cursor-pointer"
              >
                {isEllipsis ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-6 md:h-6"
                      >
                        <BreadcrumbEllipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      className="w-auto"
                      collisionPadding={20}
                    >
                      {ellipsis.map(s => {
                        const oIdx = getOriginalIdx(s);
                        return (
                          <span
                            key={s.basename}
                            className={cn(
                              'flex cursor-pointer items-center rounded p-1 text-sm',
                              'transition-colors duration-100 hover:bg-accent'
                            )}
                            onClick={() => onPathChange(s.filename, oIdx)}
                          >
                            <FolderIcon size={16} className="mr-1" />
                            {s.basename}
                          </span>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <BreadcrumbPage
                    className="inline-flex items-center"
                    onClick={() => onPathChange(stat.filename, oIdx)}
                  >
                    <Icon size={16} className="mr-1 shrink-0" />
                    <p className="line-clamp-1 break-all">{stat.basename}</p>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </IBreadcrumb>
  );
}
