import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import { CircleDotIcon, ClockIcon, FileIcon } from 'lucide-react';

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
  const color = isSuccess ? 'green' : withFailed ? 'yellow' : 'red';

  return (
    <Card className="group cursor-pointer rounded transition-transform hover:-translate-y-1 hover:bg-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleDotIcon
            size={15}
            color={color}
            className="group-hover:animate-ping"
          ></CircleDotIcon>
          Task #{props.idx}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-xs text-muted-foreground md:text-sm">
        <span className="flex items-center gap-2">
          <ClockIcon size={15} className="relative -top-[1px]"></ClockIcon>
          {dayjs(task.start).format('MM-DD HH:mm')}
        </span>
        <span className="flex items-center gap-2">
          <FileIcon size={15} className="relative -top-[1px]"></FileIcon>
          {success} of {total} files renamed
        </span>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
