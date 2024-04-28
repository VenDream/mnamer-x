'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { LoadingIcon } from '@/constants/custom-icons';
import { rename } from '@/lib/client-api';
import { getCurrentDatetime } from '@/lib/utils';
import { useStore } from '@/store';
import { ProcessResult, ProcessTask, Response, TASK_TYPE } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CaretSortIcon,
  Cross1Icon,
  PlayIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Result } from './result';

const formSchema = z.object({
  files: z
    .array(
      z.object({
        keyword: z.string().optional(),
        filename: z.string().min(1, { message: 'Filename is required' }),
      })
    )
    .min(1, { message: 'Please input at least one file.' }),
});
export type InputData = z.infer<typeof formSchema>;

export default function Manual() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ProcessResult[]>([]);
  const addTask = useStore(state => state.addTask);
  const updateTaskResult = useStore(state => state.updateTaskResult);

  const form = useForm<InputData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [{ keyword: '', filename: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'files',
  });

  const addFile = () => {
    if (fields.length >= ENV_CONFIG.MAX_FILES_PER_TASK) {
      const max = ENV_CONFIG.MAX_FILES_PER_TASK;
      const maxStr = `(${max} of ${max})`;
      toast.error(`Maximum number of files exceeded ${maxStr}`);
      return;
    }
    append({ keyword: '', filename: '' });
  };

  const removeFile = (idx: number) => {
    if (fields.length <= 1) {
      toast.error('At least one file is required');
      return;
    }
    remove(idx);
  };

  const updateResult = useCallback(
    (idx: number, patch: Partial<ProcessResult>) => {
      setResults(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], ...patch };
        return next;
      });
      updateTaskResult(idx, patch);
    },
    [updateTaskResult]
  );

  const submit = async (values: InputData) => {
    try {
      setIsSubmitting(true);
      const start = getCurrentDatetime();
      const response = await rename(values);
      const data = (await response.data) as Response<ProcessResult[]>;
      const { code, data: results, errormsg } = data;
      if (code !== 0) {
        throw new Error(errormsg || 'Failed to fetch');
      }
      setResults(results || []);
      const task: ProcessTask = {
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
      setResults([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>📄 Input</CardTitle>
          <CardDescription>task input</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex flex-col gap-2 rounded-sm border-[1px] p-4"
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
                          ></Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`files.${index}.keyword`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="md:w-[50%]">
                        <Collapsible className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <QuestionMarkCircledIcon className="mr-1"></QuestionMarkCircledIcon>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    keyword helps to identify media file more
                                    accurately
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            keyword
                            <CollapsibleTrigger asChild className="ml-1">
                              <Button type="button" variant="ghost" size="icon">
                                <CaretSortIcon className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="e.g.: Violet Evergarden"
                                {...field}
                              ></Input>
                            </FormControl>
                            <FormMessage />
                          </CollapsibleContent>
                        </Collapsible>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() => removeFile(index)}
                    className="absolute right-2 top-2 rounded-full"
                  >
                    <Cross1Icon></Cross1Icon>
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
                  <PlusCircledIcon className="mr-2"></PlusCircledIcon>
                  Add file
                  <span className="ml-2 hidden text-muted-foreground md:block">
                    ({fields.length}/{ENV_CONFIG.MAX_FILES_PER_TASK})
                  </span>
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-[150px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <LoadingIcon className="text-lg"></LoadingIcon>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlayIcon className="text-lg"></PlayIcon>
                      Start
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
      <Card className="w-full md:max-w-screen-lg">
        <CardHeader>
          <CardTitle>📝 Output</CardTitle>
          <CardDescription>task output</CardDescription>
        </CardHeader>
        <CardContent>
          <Result result={results} updateResult={updateResult}></Result>
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
}
