'use client';

import { DeleteConfirm } from '@/components/delete-confirm';
import { ResultTable } from '@/components/result-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  SelectResult,
  WebDAVExplorer,
  WebDAVExplorerHandle,
} from '@/components/webdav-explorer';
import { VIDEO_FILES } from '@/constants/file-types';
import { useProcessResults } from '@/hooks/use-process-results';
import { rename } from '@/lib/client-api';
import { getCurrentDatetime } from '@/lib/utils';
import { create } from '@/lib/webdav-client';
import { useStore } from '@/store';
import {
  InputData,
  ProcessResult,
  ProcessTask,
  Response,
  TASK_TYPE,
  WebDAVInput,
} from '@/types';
import { PromisePool } from '@supercharge/promise-pool';
import { produce } from 'immer';
import {
  CirclePlusIcon,
  LoaderCircleIcon,
  PlayIcon,
  XIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { FileStat } from 'webdav';
import { WebDAVContext, WebDAVCtx } from './ctx';
import { FileSource } from './file-source';

export function WebDAV() {
  const selectorRef = useRef<WebDAVExplorerHandle>(null);
  const webdavClients = useStore(state => state.settings.webdav);
  const [tid, setTid] = useState(-1);
  const [fileSource, setFileSource] = useState<SelectResult>(() => ({
    clientId: Object.values(webdavClients)[0]?.id || -1,
    dirs: [],
    files: [],
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTask = useStore(state => state.addTask);
  const results = useProcessResults(tid);

  const { dirs = [], files = [] } = fileSource || {};
  const isEmpty = dirs.length === 0 && files.length === 0;

  const removeItem = useCallback((stat: FileStat) => {
    setFileSource(data => {
      return produce(data, draft => {
        if (!draft) return;
        const list = draft[stat.type === 'directory' ? 'dirs' : 'files'];
        const idx = list.findIndex(s => s.filename === stat.filename);
        list.splice(idx, 1);
      });
    });
  }, []);

  const getInputData = async () => {
    const { clientId = -1, dirs = [], files = [] } = fileSource || {};

    const inputData: InputData = {
      type: TASK_TYPE.WEB_DAV,
      clientId,
      files: [],
    };

    const inputFiles: WebDAVInput['files'] = [];

    // dirs files
    if (clientId > 0 && dirs.length > 0) {
      const client = create(webdavClients[clientId]);
      const { results } = await PromisePool.withConcurrency(10)
        .for(dirs)
        .useCorrespondingResults()
        .process(async dir => {
          const stats = (await client.getDirectoryContents(
            dir.filename
          )) as FileStat[];
          return stats
            .filter(s => isVideoFile(s))
            .map(v => ({
              dirpath: v.filename,
              filename: v.basename,
            }));
        });
      const files = results.flat() as WebDAVInput['files'];
      inputFiles.push(...files);
    }

    // files
    files.forEach(file => {
      inputFiles.push({
        dirpath: file.filename,
        filename: file.basename,
      });
    });

    // dedupe
    inputData.files = inputFiles.reduce(
      (acc, curr) => {
        const exists = acc.some(item => item.filename === curr.filename);
        !exists && acc.push(curr);
        return acc;
      },
      [] as WebDAVInput['files']
    );

    return inputData;
  };

  const submit = async () => {
    try {
      setIsSubmitting(true);
      const start = getCurrentDatetime();
      const inputData = await getInputData();

      if (inputData.files.length <= 0) {
        toast.error('No video files found, please check the input');
        return;
      }

      const response = await rename(inputData);
      const data = response.data as Response<ProcessResult[]>;
      const { code, data: results, errormsg } = data;
      if (code !== 0) {
        throw new Error(errormsg || 'Failed to fetch');
      }
      const tid = Date.now();
      setTid(tid);
      const task: ProcessTask = {
        id: tid,
        type: TASK_TYPE.WEB_DAV,
        start,
        end: getCurrentDatetime(),
        results: results || [],
      };
      addTask(task);
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ctx: WebDAVCtx = useMemo(
    () => ({
      fileSource,
      isSubmitting,
      removeItem,
    }),
    [fileSource, isSubmitting, removeItem]
  );

  useEffect(() => {
    fileSource && console.log(fileSource);
  }, [fileSource]);

  return (
    <WebDAVContext.Provider value={ctx}>
      <div className="flex flex-col gap-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>task input</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <WebDAVExplorer
                mode="all"
                multiple={true}
                selected={fileSource}
                onSelect={setFileSource}
                ref={selectorRef}
                accept={VIDEO_FILES}
                resetTips="File sources cleared"
              >
                <Button variant="outline" disabled={isSubmitting}>
                  <CirclePlusIcon size={16} className="mr-2" />
                  File Source
                </Button>
              </WebDAVExplorer>
              {!isEmpty && (
                <DeleteConfirm
                  title="Confirm to clear all file sources ?"
                  onConfirm={() => {
                    selectorRef.current?.cleaerSelection();
                  }}
                >
                  <Button variant="outline" disabled={isSubmitting}>
                    <XIcon size={16} className="mr-2" />
                    Clear
                  </Button>
                </DeleteConfirm>
              )}
            </div>
            <Separator className="my-6" />
            {isEmpty ? (
              <p className="text-sm text-muted-foreground">No file source.</p>
            ) : (
              <FileSource />
            )}
            {!isEmpty && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-[150px]"
                  onClick={submit}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircleIcon
                        size={20}
                        className="animate-spin animate-duration-1000"
                      />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlayIcon size={16} />
                      Start
                    </span>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>task output</CardDescription>
          </CardHeader>
          <CardContent>
            <ResultTable tid={tid} results={results} />
          </CardContent>
        </Card>
      </div>
    </WebDAVContext.Provider>
  );
}

function isVideoFile(stat: FileStat) {
  return (
    stat.type === 'file' &&
    VIDEO_FILES.some(format => {
      return stat.basename.toLowerCase().endsWith(format);
    })
  );
}
