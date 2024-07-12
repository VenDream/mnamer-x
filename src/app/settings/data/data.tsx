import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { useStore } from '@/store';
import { RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsCard } from '../settings-card';

export function DataSettings() {
  const resetSettings = useStore(state => state.resetSettings);

  const reset = () => {
    resetSettings();
    toast.success('Settings reset');
  };

  return (
    <SettingsCard title="Data" desc="Manage settings data" className="block">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <RotateCcwIcon size={16} className="mr-2" />
            Reset
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90vw] md:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <TriangleAlertIcon size={20} className="mr-2" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="break-all">
              This action cannot be undone and will reset all your settings to
              defaults.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={reset}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsCard>
  );
}
