import { DeleteConfirm } from '@/components/delete-confirm';
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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { HistoryContext, HistoryCtx } from './context';

interface IProps {
  tid: number;
}

const DEBUG_BACKDROP = 'https://placehold.co/1280x720?text=backdrop';
const FAILED_BACKDROP = 'https://placehold.co/1280x720?text=task+failed';

export function TaskCard(props: IProps) {
  const task = useStore(state => state.tasks[props.tid]);
  const tmdbs = useStore(state => state.tmdbs);
  const removeTask = useStore(state => state.removeTask);
  const { selectMode } = useContext(HistoryContext) as HistoryCtx;

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
  const isSuccess = success === total && total > 0;
  const withFailed = success < total && success > 0;
  const isFailed = !isSuccess && !withFailed;
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
    <Link href={`${ROUTE.TASKS}/${props.tid}`}>
      <Card
        className={cn(
          'group cursor-pointer rounded bg-accent/20',
          'md:hover:outline md:hover:outline-2 md:group-hover:border-transparent',
          {
            'md:hover:outline-green-500': isSuccess,
            'md:hover:bg-green-500/20': isSuccess,
            'md:hover:outline-orange-500': withFailed,
            'md:hover:bg-orange-500/20': withFailed,
            'md:hover:outline-red-500': isFailed,
            'md:hover:bg-red-500/20': isFailed,
          }
        )}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex select-none items-center gap-1">
              <CircleDotIcon size={20} color={color} />
              Task #{tLabel}
            </div>

            <div
              className="relative -top-[2px]"
              onClick={e => {
                e.preventDefault();
              }}
            >
              <DeleteConfirm
                onConfirm={() => {
                  removeTask(props.tid);
                  toast.success('Task deleted');
                }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={cn(
                    'relative right-[-10px] rounded-full',
                    'md:opacity-0 md:group-hover:opacity-100',
                    {
                      'opacity-100': !selectMode,
                      'opacity-0': selectMode,
                    }
                  )}
                >
                  <XIcon size={20} />
                </Button>
              </DeleteConfirm>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 py-0 text-sm text-foreground">
          <AspectRatio ratio={16 / 9} className="rounded-sm border shadow">
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
            />
          </AspectRatio>
          <div className="space-y-2">
            <span className="flex items-center gap-2">
              <FileIcon size={18} />
              <Progress
                value={percent}
                className={cn('bg-accent/80', {
                  '[&>*]:bg-green-500': isSuccess,
                  '[&>*]:bg-orange-500': withFailed,
                  '[&>*]:bg-red-500': isFailed,
                })}
              />
              {success}/{total}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 leading-4">
            <ClockIcon size={16} className="relative -top-[1px]" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1 leading-4">
            <BotIcon size={16} className="relative -top-[1px]" />
            {task.type}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
