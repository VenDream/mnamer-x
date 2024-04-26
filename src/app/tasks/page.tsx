import CloudStorage from '@/app/_pages/cloud-storage';
import ManualPage from '@/app/_pages/manual';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebDAV from '../_pages/web-dav';

export default function Jobs() {
  return (
    <div className="p-4">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="w-full justify-start md:max-w-screen-lg">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="web-dav">WebDAV</TabsTrigger>
          <TabsTrigger value="cloud-storage">CloudStorage</TabsTrigger>
        </TabsList>
        <TabsContent
          value="manual"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <ManualPage></ManualPage>
        </TabsContent>
        <TabsContent
          value="web-dav"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <WebDAV></WebDAV>
        </TabsContent>
        <TabsContent
          value="cloud-storage"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <CloudStorage></CloudStorage>
        </TabsContent>
      </Tabs>
    </div>
  );
}
