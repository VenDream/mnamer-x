import CloudStorage from '@/app/_pages/cloud-storage';
import ManualPage from '@/app/_pages/manual';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Jobs() {
  return (
    <div className="p-4">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="w-full justify-start md:max-w-screen-lg">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="cloud-storage">Cloud Storage</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <ManualPage></ManualPage>
        </TabsContent>
        <TabsContent value="cloud-storage" className="flex items-center gap-2">
          <CloudStorage></CloudStorage>
        </TabsContent>
      </Tabs>
    </div>
  );
}
