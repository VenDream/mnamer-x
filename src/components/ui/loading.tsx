import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';

interface IProps {
  text?: string;
  className?: string;
}

export function Loading(props: IProps) {
  return (
    <span className={cn('flex items-center gap-2', props.className)}>
      <LoaderIcon size={16} className="animate-spin" />
      {props.text || 'Loading...'}
    </span>
  );
}
