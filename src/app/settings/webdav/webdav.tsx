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

export function WebDAVSettings() {
  const webdavs = useStore(state => Object.values(state.settings.webdav));

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>WebDAV Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {webdavs.length > 0 ? (
          webdavs.map(webdav => (
            <div key={webdav.id} className="flex">
              {webdav.name}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No WebDAV servers have been configured yet.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <CirclePlusIcon size={16} className="mr-2"></CirclePlusIcon>
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
