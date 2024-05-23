import { DeleteConfirm } from '@/components/delete-confirm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStore } from '@/store';
import { EditServer } from './edit-server';

export function ServerList() {
  const webdavs = useStore(state => Object.values(state.settings.webdav));
  const removeWebDAV = useStore(state => state.removeWebDAV);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webdavs.length > 0 ? (
          webdavs.map(webdav => (
            <TableRow key={webdav.id}>
              <TableCell>
                <p className="line-clamp-1 break-all">{webdav.name}</p>
              </TableCell>
              <TableCell>
                <p className="line-clamp-1 break-all">{webdav.remoteURL}</p>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <EditServer id={webdav.id}>
                    <p className="cursor-pointer text-primary hover:underline hover:underline-offset-4">
                      edit
                    </p>
                  </EditServer>
                  <DeleteConfirm onConfirm={() => removeWebDAV(webdav.id)}>
                    <p className="cursor-pointer text-primary hover:underline hover:underline-offset-4">
                      delete
                    </p>
                  </DeleteConfirm>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-muted-foreground">
              No WebDAV servers have been added yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
