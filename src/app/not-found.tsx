import { UnderlineLink } from '@/components/link';
import { Separator } from '@/components/ui/separator';
import { FrownIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground md:h-8 md:flex-row">
        <div className="flex items-center gap-4">
          <FrownIcon size={30} />
          <h2 className="text-2xl">404</h2>
        </div>
        <Separator
          orientation="vertical"
          className="hidden bg-muted-foreground/50 md:block"
        />
        <p className="text-sm">
          This page could not be found.
          <UnderlineLink href="/" className="ml-2">
            Go back.
          </UnderlineLink>
        </p>
      </div>
    </div>
  );
}
