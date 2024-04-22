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
import { LoadingIcon } from '@/constants/custom-icons';
import { ProcessResult, Response } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CaretSortIcon,
  Cross1Icon,
  PlayIcon,
  PlusCircledIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  const [result, setResult] = useState<ProcessResult[]>([]);

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
    append({ keyword: '', filename: '' });
  };

  const removeFile = (idx: number) => {
    if (fields.length <= 1) {
      toast.error('At least one file is required');
      return;
    }
    remove(idx);
  };

  const submit = async (values: InputData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/naming', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as Response<ProcessResult[]>;
      const { code, data: result, errormsg } = data;
      if (code !== 0) {
        throw new Error(errormsg || 'failed to fetch');
      }
      setResult(result || []);
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error(`Oops! Something went wrong: ${error.message}`);
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
          <p className="w-full text-sm">
            {result.map(r => JSON.stringify(r.output.meta || {}))}
          </p>
          <p className="w-full text-sm">
            {result.map(r => JSON.stringify(r.output.tmdb || {}))}
          </p>
        </CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
}
