import { cn } from '@/lib/utils';
import { LoaderCircleIcon } from 'lucide-react';

interface IProps {
  text?: string;
  className?: string;
}

export function Loading(props: IProps) {
  return (
    <span className={cn('flex items-center gap-2', props.className)}>
      <LoaderCircleIcon
        size={20}
        className="animate-spin animate-duration-1000"
      />
      {props.text || 'Loading...'}
    </span>
  );
}
