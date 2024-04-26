import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConstructionIcon } from '@/constants/custom-icons';

export default function WebDAV() {
  return (
    <Alert>
      <ConstructionIcon></ConstructionIcon>
      <AlertTitle>WIP</AlertTitle>
      <AlertDescription>
        Development in progress, stay tuned :)
      </AlertDescription>
    </Alert>
  );
}
