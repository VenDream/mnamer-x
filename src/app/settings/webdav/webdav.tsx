import { Button } from '@/components/ui/button';
import { CirclePlusIcon } from 'lucide-react';
import { SettingsCard } from '../settings-card';
import { EditServer } from './edit-server';
import { ServerList } from './server-list';

export function WebDAVSettings() {
  return (
    <SettingsCard title="WebDAV" desc="Manage WebDAV servers">
      <ServerList />
      <div className="flex flex-col md:flex-row md:justify-end">
        <EditServer>
          <Button variant="outline">
            <CirclePlusIcon size={16} className="mr-2" />
            Add
          </Button>
        </EditServer>
      </div>
    </SettingsCard>
  );
}
