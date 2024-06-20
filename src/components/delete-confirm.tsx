import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Trash2Icon } from 'lucide-react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface IProps extends PropsWithChildren {
  icon?: ReactNode;
  title?: ReactNode;
  onConfirm?: () => void;
}

export function DeleteConfirm(props: IProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="w-auto" collisionPadding={20}>
        <div className="space-y-4">
          <h1 className="flex items-center gap-2 text-sm">
            {props.icon || <Trash2Icon size={16} />}
            {props.title || 'Confirm to delete ?'}
          </h1>
          <div className="flex justify-between gap-3">
            <Button
              size="sm"
              variant="outline"
              className="w-1/2"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-1/2"
              onClick={() => {
                props.onConfirm?.();
                setOpen(false);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
