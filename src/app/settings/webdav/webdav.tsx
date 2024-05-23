import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CirclePlusIcon } from 'lucide-react';
import { EditServer } from './edit-server';
import { ServerList } from './server-list';

export function WebDAVSettings() {
  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>WebDAV</CardTitle>
      </CardHeader>
      <CardContent>
        <ServerList></ServerList>
      </CardContent>
      <CardFooter className="flex justify-end">
        <EditServer>
          <Button variant="outline" className="w-full md:w-auto">
            <CirclePlusIcon size={16} className="mr-2"></CirclePlusIcon>
            Add
          </Button>
        </EditServer>
      </CardFooter>
    </Card>
  );
}
