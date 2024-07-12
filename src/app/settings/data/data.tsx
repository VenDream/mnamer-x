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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/store';
import { RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import { toast } from 'sonner';

export function DataSettings() {
  const resetSettings = useStore(state => state.resetSettings);

  const reset = () => {
    resetSettings();
    toast.success('Settings reset');
  };

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-lg">Data</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
