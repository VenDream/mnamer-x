import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getStatItemIcon } from '@/components/webdav-explorer';
import { cn } from '@/lib/utils';
import { CircleXIcon, InfoIcon } from 'lucide-react';
import { FileStat } from 'webdav';
import { useWebDAVCtx } from './ctx';

interface ItemListProps {
  label: string;
  tips?: React.ReactNode;
  list: FileStat[];
}

function ItemList(props: ItemListProps) {
  const { label, tips, list } = props;
  const { isSubmitting, removeItem } = useWebDAVCtx();

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
              <TooltipContent
                side="top"
                align="start"
                sideOffset={10}
                alignOffset={-40}
              >
                {tips}
              </TooltipContent>
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
              disabled={isSubmitting}
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
}

export function FileSource() {
  const { fileSource } = useWebDAVCtx();
  const { dirs = [], files = [] } = fileSource || {};

  return (
    <div className="grid grid-cols-[50px_1fr] gap-2 rounded-sm border px-2 py-4 md:gap-4">
      <ItemList
        label="Dirs"
        list={dirs}
        tips={
          <p>
            Automatically select video files within the directory
            (non-recursive)
          </p>
        }
      />
      <ItemList label="Files" list={files} />
    </div>
  );
}
