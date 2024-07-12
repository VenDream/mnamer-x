import { DeleteConfirm } from '@/components/delete-confirm';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStore } from '@/store';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { EditServer } from './edit-server';

export function ServerList() {
  const webdavs = useStore(state => Object.values(state.settings.webdav));
  const removeWebDAV = useStore(state => state.removeWebDAV);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border bg-muted/50">
          <TableHead className="w-[80px] md:w-[150px]">Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead className="w-[80px] text-center md:w-[150px]">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webdavs.length > 0 ? (
          webdavs.map(webdav => (
            <EditServer id={webdav.id} key={webdav.id}>
              <TableRow className="cursor-pointer !border">
                <TableCell>
                  <p className="line-clamp-1 break-all">{webdav.name}</p>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-1 break-all">{webdav.remoteURL}</p>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="edit"
                      className="h-6 w-6 text-primary hover:text-primary"
                    >
                      <PencilIcon size={14} className="!stroke-2" />
                    </Button>
                    <DeleteConfirm onConfirm={() => removeWebDAV(webdav.id)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="delete"
                        onClick={e => e.stopPropagation()}
                        className="h-6 w-6 text-destructive hover:text-destructive"
                      >
                        <Trash2Icon size={14} className="!stroke-2" />
                      </Button>
                    </DeleteConfirm>
                  </div>
                </TableCell>
              </TableRow>
            </EditServer>
          ))
        ) : (
          <TableRow className="!border">
            <TableCell colSpan={3} className="text-muted-foreground">
              No WebDAV servers.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
