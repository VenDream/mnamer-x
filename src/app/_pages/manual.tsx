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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingIcon } from '@/constants/custom-icons';
import { ProcessResult, Response } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().optional(),
  files: z.string().min(1, { message: 'Please input at least one file.' }),
});
type InputData = z.infer<typeof formSchema>;

export default function Manual() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ProcessResult[]>([]);

  const form = useForm<InputData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      files: '',
    },
  });

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
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="e.g., Violet Evergarden"
                      />
                    </FormControl>
                    <FormDescription>
                      <span className="flex items-center gap-1">
                        <InfoCircledIcon className="hidden md:block"></InfoCircledIcon>
                        The topic helps mnamer-x recognize media files more
                        accurately.
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Names</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        disabled={isSubmitting}
                        placeholder="one line per file, e.g., Violet Evergarden_01_4k.mp4"
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="w-[150px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    <LoadingIcon className="text-lg"></LoadingIcon>Processing...
                  </span>
                ) : (
                  'Go'
                )}
              </Button>
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
        <CardContent>{result.map(r => r.output)}</CardContent>
        <CardFooter className="hidden"></CardFooter>
      </Card>
    </div>
  );
}
