import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  // @TODO add a more detailed loading skeleton
  if (true) {
    return null;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
