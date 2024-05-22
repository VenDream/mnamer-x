import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStore } from '@/store';
import { CirclePlusIcon } from 'lucide-react';
import { EditServer } from './edit-server';

export function WebDAVSettings() {
  const webdavs = useStore(state => Object.values(state.settings.webdav));

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>WebDAV</CardTitle>
      </CardHeader>
      <CardContent>
        {webdavs.length > 0 ? (
          webdavs.map(webdav => (
            <EditServer key={webdav.id} id={webdav.id}>
              <Button variant="outline">{webdav.name}</Button>
            </EditServer>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No WebDAV servers have been configured yet.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <EditServer>
          <Button variant="outline">
            <CirclePlusIcon size={16} className="mr-2"></CirclePlusIcon>
            Add
          </Button>
        </EditServer>
      </CardFooter>
    </Card>
  );
}
