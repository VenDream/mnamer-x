import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStore } from '@/store';
import { Trash2Icon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithChildren<any> {
  tid: number;
}

export function DeleteTask(props: IProps) {
  const [open, setOpen] = useState(false);
  const removeTask = useStore(state => state.removeTask);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="w-48 rounded-sm" collisionPadding={20}>
        <div className="space-y-4">
          <h1 className="flex items-center gap-2 leading-3">
            <Trash2Icon size={16}></Trash2Icon>Confirm ?
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
                removeTask(props.tid);
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
