import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { LoaderCircleIcon } from 'lucide-react';

export default function Loading() {
  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex h-full w-full items-center justify-center">
          <VisuallyHidden>
            <DialogTitle>Loading</DialogTitle>
          </VisuallyHidden>
          <LoaderCircleIcon
            size={24}
            className="animate-spin text-white animate-duration-1000"
          />
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
