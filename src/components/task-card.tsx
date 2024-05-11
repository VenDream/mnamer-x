import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import { BotIcon, CircleDotIcon, ClockIcon, FileIcon } from 'lucide-react';
import Link from 'next/link';

interface IProps {
  tid: number;
  idx: number;
}

export function TaskCard(props: IProps) {
  const task = useStore(state => state.tasks[props.tid]);
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
          'group cursor-pointer rounded transition-transform hover:-translate-y-2',
          {
            'hover:bg-green-500/20': isSuccess,
            'hover:border-green-500/20': isSuccess,
            'dark:hover:bg-green-500/30': isSuccess,
            'dark:hover:border-green-500/30': isSuccess,
            'hover:bg-orange-500/20': withFailed,
            'hover:border-orange-500/20': withFailed,
            'dark:hover:bg-orange-500/30': withFailed,
            'dark:hover:border-orange-500/30': withFailed,
            'hover:bg-red-500/20': isFailed,
            'hover:border-red-500/20': isFailed,
            'dark:hover:bg-red-500/30': isFailed,
            'dark:hover:border-red-500/30': isFailed,
          }
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDotIcon size={15} color={color}></CircleDotIcon>
            Task #{props.idx}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-foreground md:text-sm">
          <span className="flex items-center gap-2">
            <BotIcon size={15} className="relative -top-[1px]"></BotIcon>
            <Badge variant="outline" className="rounded-[2px] bg-accent">
              {task.type}
            </Badge>
          </span>
          <span className="flex items-center gap-2">
            <FileIcon size={15} className="relative -top-[1px]"></FileIcon>
            {success} of {total} files renamed
          </span>
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
