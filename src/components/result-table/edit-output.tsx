import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropsWithChildren, useState } from 'react';

interface IProps extends PropsWithChildren {
  output: string;
  modified?: string;
  onClose?: () => void;
  onSave: (modified: string) => void;
}

export function EditOutput(props: IProps) {
  const [open, setOpen] = useState(false);
  const [modified, setModified] = useState(props.modified || props.output);

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
        className="w-[90vw] max-w-[600px]"
        onOpenAutoFocus={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit output</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 md:grid-cols-5">
            <Label htmlFor="original" className="text-right">
              Original
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
              placeholder="Leave it empty to use the system output"
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
