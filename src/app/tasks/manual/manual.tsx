'use client';

import { ResultTable } from '@/components/result-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ENV_CONFIG } from '@/constants';
import { useProcessResults } from '@/hooks/use-process-results';
import { rename } from '@/lib/client-api';
import { getCurrentDatetime } from '@/lib/utils';
import { useStore } from '@/store';
import { ProcessResult, ProcessTask, Response, TASK_TYPE } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronsUpDownIcon,
  CircleHelpIcon,
  CirclePlusIcon,
  LoaderIcon,
  PlayIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const maxFiles = ENV_CONFIG.MAX_FILES_PER_MANUAL_TASK;

const formSchema = z.object({
  type: z.literal(TASK_TYPE.MANUAL),
  files: z
    .array(
      z.object({
        year: z.string().optional(),
        keyword: z.string().optional(),
        filename: z.string().min(1, { message: 'Filename is required' }),
      })
    )
    .min(1, { message: 'Please input at least one file.' }),
});
export type ManualInput = z.infer<typeof formSchema>;

export function Manual() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tid, setTid] = useState(-1);
  const addTask = useStore(state => state.addTask);
  const results = useProcessResults(tid);

  const form = useForm<ManualInput>({
    resolver: zodResolver(formSchema),
    values: {
      type: TASK_TYPE.MANUAL,
      files: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'files',
  });

  const addFile = () => {
    if (fields.length >= maxFiles) {
      const maxStr = `(${maxFiles} of ${maxFiles})`;
      toast.error(`Maximum number of files exceeded ${maxStr}`);
      return;
    }
    append({ year: '', keyword: '', filename: '' });
  };

  const submit = async (values: ManualInput) => {
    try {
      setIsSubmitting(true);
      const start = getCurrentDatetime();
      const response = await rename(values);
      const data = response.data as Response<ProcessResult[]>;
      const { code, data: results, errormsg } = data;
      if (code !== 0) {
        throw new Error(errormsg || 'Failed to fetch');
      }
      const tid = Date.now();
      setTid(tid);
      const task: ProcessTask = {
        id: tid,
        type: TASK_TYPE.MANUAL,
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

  const isEmpty = form.getValues('files').length === 0;

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>task input</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex flex-col gap-2 rounded border-[1px] p-4"
                >
                  <FormField
                    name={`files.${index}.filename`}
                    key={item.id}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>filename</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isSubmitting}
                            placeholder="the name of media file"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Collapsible className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CircleHelpIcon size={16} className="mr-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              additional info helps to improve the media
                              recognition accuracy
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      additional info
                      <CollapsibleTrigger asChild className="ml-1">
                        <Button type="button" variant="ghost" size="icon">
                          <ChevronsUpDownIcon size={16} />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      <FormField
                        name={`files.${index}.year`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="md:w-[50%]">
                            <FormControl>
                              <Input
                                type="number"
                                min={1900}
                                max={new Date().getFullYear()}
                                disabled={isSubmitting}
                                placeholder="release year, e.g., 2008"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`files.${index}.keyword`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="md:w-[50%]">
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="keyword, e.g., Violet Evergarden"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() => remove(index)}
                    className="absolute right-2 top-2 rounded-full"
                  >
                    <XIcon size={20} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFile}
                  disabled={isSubmitting}
                >
                  <CirclePlusIcon size={16} className="mr-2" />
                  Add file
                  <span className="ml-2 hidden text-muted-foreground md:block">
                    ({fields.length}/{maxFiles})
                  </span>
                </Button>
                {!isEmpty && (
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSubmitting}
                    className="w-[150px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <LoaderIcon size={16} className="animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <PlayIcon size={16} />
                        Start
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardDescription>task output</CardDescription>
        </CardHeader>
        <CardContent>
          <ResultTable tid={tid} results={results} />
        </CardContent>
      </Card>
    </div>
  );
}
