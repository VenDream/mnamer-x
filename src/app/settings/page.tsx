'use client';

import { Loading } from '@/components/ui/loading';
import { useStoreHydrate } from '@/hooks/use-store-hydrate';
import { FormatterSettings } from './formatter';
import { LLMSettings } from './llm';
import { WebDAVSettings } from './webdav';

export default function Settings() {
  const isHydrated = useStoreHydrate();

  return (
    <div className="p-4 md:max-w-screen-lg">
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
    </div>
  );
}
