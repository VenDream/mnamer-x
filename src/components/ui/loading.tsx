import { LoaderIcon } from 'lucide-react';

export function Loading({ text }: { text?: string }) {
  return (
    <span className="flex items-center gap-2">
      <LoaderIcon size={15} className="animate-spin"></LoaderIcon>
      {text || 'Loading...'}
    </span>
  );
}
