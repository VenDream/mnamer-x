import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithChildren<any> {
  output: string;
  onSave: (modified: string) => void;
  onClose?: () => void;
}

export function EditOutput(props: IProps) {
  const [open, setOpen] = useState(false);
  const [modified, setModified] = useState(props.output);

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open);
        if (!open) props.onClose?.();
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className="w-[90vw] max-w-[600px] rounded-sm"
        onOpenAutoFocus={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start">
            <Pencil2Icon className="mr-2 text-lg"></Pencil2Icon>Edit output
          </DialogTitle>
          <DialogDescription className="text-left text-xs">
            Modify the output to what you prefer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 md:grid-cols-5">
            <Label htmlFor="original" className="text-right">
              Output
            </Label>
            <Input
              id="original"
              readOnly
              className="col-span-3 bg-slate-100/50 dark:bg-slate-800/50 md:col-span-4"
              defaultValue={props.output}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 md:grid-cols-5">
            <Label htmlFor="modified" className="text-right">
              Modified
            </Label>
            <Input
              id="modified"
              value={modified}
              className="col-span-3 md:col-span-4"
              onChange={e => setModified(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onSave(modified)}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
