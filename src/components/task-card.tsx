import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ENV_CONFIG } from '@/constants';
import { getTmdbImageUrl } from '@/lib/tmdb-image';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import { Cross1Icon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { BotIcon, CircleDotIcon, ClockIcon, FileIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { DeleteTask } from './delete-task';

interface IProps {
  tid: number;
  idx: number;
}

const DEBUG_BACKDROP = 'https://placehold.co/1280x720?text=backdrop';
const FAILED_BACKDROP = 'https://placehold.co/1280x720?text=task+failed';

export function TaskCard(props: IProps) {
  const task = useStore(state => state.tasks[props.tid]);
  const tmdbs = useStore(state => state.tmdbs);

  const taskImage = useMemo(() => {
    const resultWithTmdb = task.results.find(r => r.output.tmdbid > 0);
    if (!resultWithTmdb) return '';
    const tmdbid = resultWithTmdb.output.tmdbid;
    return tmdbs[tmdbid].backdrop_path || '';
  }, [task.results, tmdbs]);

  const total = task.results.length;
  const success = task.results.filter(t => t.output.tmdbid > 0).length;
  const isSuccess = success === total;
  const withFailed = success < total && success > 0;
  const isFailed = success === 0;
  const color = isSuccess ? 'green' : withFailed ? 'orange' : 'red';

  return (
    <Link href={`/history/${props.tid}`}>
      <Card
        className={cn(
          'group cursor-pointer rounded hover:outline hover:outline-2 group-hover:border-transparent',
          {
            'hover:outline-green-500': isSuccess,
            'hover:bg-green-500/20': isSuccess,
            'hover:outline-orange-500': withFailed,
            'hover:bg-orange-500/20': withFailed,
            'hover:outline-red-500': isFailed,
            'hover:bg-red-500/20': isFailed,
          }
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CircleDotIcon size={20} color={color}></CircleDotIcon>
              Task #{props.idx}
            </div>
            <div
              className="relative -top-[2px]"
              onClick={e => {
                e.preventDefault();
              }}
            >
              <DeleteTask tid={props.tid}>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="visible rounded-full group-hover:visible md:invisible"
                >
                  <Cross1Icon></Cross1Icon>
                </Button>
              </DeleteTask>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-foreground md:text-sm">
          <AspectRatio ratio={16 / 9}>
            <Image
              fill
              alt="BACKDROP"
              className="rounded-sm object-cover"
              src={
                ENV_CONFIG.DEBUG_MODE
                  ? DEBUG_BACKDROP
                  : taskImage
                    ? getTmdbImageUrl(taskImage, 'w500')
                    : FAILED_BACKDROP
              }
            ></Image>
          </AspectRatio>
          <div className="space-y-2">
            <span className="flex items-center gap-2">
              <BotIcon size={15} className="relative -top-[1px]"></BotIcon>
              <Badge
                variant="outline"
                className={cn('rounded-none border-none text-white', {
                  'bg-green-500': isSuccess,
                  'bg-orange-500': withFailed,
                  'bg-red-500': isFailed,
                })}
              >
                {task.type}
              </Badge>
            </span>
            <span className="flex items-center gap-2">
              <FileIcon size={15} className="relative -top-[1px]"></FileIcon>
              {success} of {total} files renamed
            </span>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground md:text-sm">
          <span className="flex items-center gap-2">
            <ClockIcon size={15} className="relative -top-[1px]"></ClockIcon>
            {dayjs(task.start).format('MM-DD HH:mm')}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
