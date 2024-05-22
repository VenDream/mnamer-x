import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ENV_CONFIG, ROUTE } from '@/constants';
import { getTmdbImageUrl } from '@/lib/tmdb-image';
import { cn, getDateTimeDiff } from '@/lib/utils';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import {
  BotIcon,
  CircleDotIcon,
  ClockIcon,
  FileIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [percent, setPercent] = useState(0);
  const [dateStr, setDateStr] = useState('');
  const pTimer = useRef<NodeJS.Timeout>();
  const dTimer = useRef<NodeJS.Timeout>();

  const taskImage = useMemo(() => {
    const resultWithTmdb = task.results.find(r => r.output.tmdbid > 0);
    if (!resultWithTmdb) return '';
    const tmdbid = resultWithTmdb.output.tmdbid;
    return tmdbs[tmdbid].backdrop_path || '';
  }, [task.results, tmdbs]);

  const updateDateStr = useCallback(() => {
    const dateStr = getDateTimeDiff(task.start, new Date());
    setDateStr(dateStr);
  }, [task.start]);

  const total = task.results.length;
  const success = task.results.filter(t => t.output.tmdbid > 0).length;
  const isSuccess = success === total;
  const withFailed = success < total && success > 0;
  const isFailed = success === 0;
  const tLabel = dayjs(task.start).format('MMDDHHmm');
  const color = isSuccess ? 'green' : withFailed ? 'orange' : 'red';

  useEffect(() => {
    pTimer.current = setTimeout(() => {
      setPercent(Math.round((success / total) * 100));
    }, 100);

    updateDateStr();
    if (dateStr && dateStr.includes('ago') && !dTimer.current) {
      const interval = dateStr.includes('hour') ? 1000 * 60 : 1000;
      dTimer.current = setInterval(updateDateStr, interval);
      console.debug(
        'dTimer started for task %s with interval %s',
        tLabel,
        interval
      );
    }

    return () => {
      clearTimeout(pTimer.current);
      pTimer.current = undefined;
      clearInterval(dTimer.current);
      dTimer.current = undefined;
      console.debug('dTimer stopped for task %s', tLabel);
    };
  }, [dateStr, success, tLabel, total, updateDateStr]);

  return (
    <Link href={`${ROUTE.HISTORY}/${props.tid}`}>
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDotIcon size={20} color={color}></CircleDotIcon>
              Task #{tLabel}
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
                  className="visible relative -right-1/2 rounded-full group-hover:visible md:invisible"
                >
                  <XIcon size={20}></XIcon>
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
              <FileIcon size={18}></FileIcon>
              <Progress
                value={percent}
                className={cn('bg-accent/80', {
                  '[&>*]:bg-green-500': isSuccess,
                  '[&>*]:bg-orange-500': withFailed,
                  '[&>*]:bg-red-500': isFailed,
                })}
              ></Progress>
              {success}/{total}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground md:text-sm">
          <span className="flex items-center gap-2 leading-4">
            <ClockIcon size={16} className="relative -top-[1px]"></ClockIcon>
            {dateStr}
          </span>
          <span className="flex items-center gap-2 leading-4">
            <BotIcon size={16} className="relative -top-[1px]"></BotIcon>
            {task.type}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
