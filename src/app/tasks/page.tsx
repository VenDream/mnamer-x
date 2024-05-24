import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TASK_TYPE } from '@/types';
import { CloudStorage } from './cloud-storage';
import { Manual } from './manual';
import { WebDAV } from './webdav';

const TASK_TYPES = Object.values(TASK_TYPE);
const TASK_PAGES: Record<TASK_TYPE, React.ReactNode> = {
  [TASK_TYPE.MANUAL]: <Manual />,
  [TASK_TYPE.WEB_DAV]: <WebDAV />,
  [TASK_TYPE.CLOUD_STORAGE]: <CloudStorage />,
};

export default function Tasks() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl">Task Execution</h1>
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="w-full justify-start md:max-w-screen-lg">
          {TASK_TYPES.map(type => (
            <TabsTrigger key={type} value={type}>
              {type.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        {TASK_TYPES.map(type => (
          <TabsContent
            key={type}
            value={type}
            forceMount
            className="data-[state=inactive]:hidden"
          >
            {TASK_PAGES[type]}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
