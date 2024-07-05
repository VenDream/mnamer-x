'use client';

import { ContentPage } from '@/components/ui/content-page';
import { Loading } from '@/components/ui/loading';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { FormatterSettings } from './formatter';
import { LLMSettings } from './llm';
import { WebDAVSettings } from './webdav';

export function Settings() {
  const isHydrated = useStoreHydrate();

  return (
    <ContentPage>
      <h1 className="mb-4 text-xl">Settings</h1>
      {isHydrated ? (
        <div className="flex flex-col gap-4">
          <LLMSettings />
          <FormatterSettings />
          <WebDAVSettings />
        </div>
      ) : (
        <Loading text="Loading data..." />
      )}
    </ContentPage>
  );
}
