import { cn } from '@/lib/utils';
import Link from 'next/link';

type LinkProps = Parameters<typeof Link>[0];

export function UnderlineLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        'underline underline-offset-[4px] hover:text-blue-500 hover:*:text-blue-500',
        props.className
      )}
    />
  );
}
