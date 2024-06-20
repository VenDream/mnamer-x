import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConstructionIcon } from 'lucide-react';

export function CloudStorage() {
  return (
    <Alert>
      <ConstructionIcon size={20} />
      <AlertTitle>WIP</AlertTitle>
      <AlertDescription>
        Development in progress, stay tuned :)
      </AlertDescription>
    </Alert>
  );
}
