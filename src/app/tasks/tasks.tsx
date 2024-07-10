'use client';

import { ContentPage } from '@/components/ui/content-page';
import { Loading } from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { TASK_TYPE } from '@/types';
import { CloudStorage } from './cloud-storage';
import { Manual } from './manual';
import { WebDAV } from './webdav';

type TaskType = Exclude<TASK_TYPE, TASK_TYPE.ALL>;

const TASK_TYPES = Object.values(TASK_TYPE).filter(
  t => t !== TASK_TYPE.ALL
) as TaskType[];
const TASK_PAGES: Record<TaskType, React.ReactNode> = {
  [TASK_TYPE.MANUAL]: <Manual />,
  [TASK_TYPE.WEB_DAV]: <WebDAV />,
  [TASK_TYPE.CLOUD_STORAGE]: <CloudStorage />,
};

export function Tasks() {
  const isHydrated = useStoreHydrate();

  return (
    <ContentPage>
      <h1 className="mb-4 text-xl">Task Execution</h1>
      {isHydrated ? (
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="w-full justify-start">
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
      ) : (
        <Loading text="Loading data..." />
      )}
    </ContentPage>
  );
}
