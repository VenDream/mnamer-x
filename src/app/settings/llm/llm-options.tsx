import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { LLMSettings } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema: z.ZodType<FormSchema> = z.object({
  baseUrl: z
    .string()
    .min(1, { message: 'Base URL is required' })
    .url({ message: 'Invalid URL' }),
  apiKey: z.string().min(1, { message: 'API Key is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  temperature: z.number(),
});

type Concrete<T> = { [K in keyof T]-?: T[K] };
type LLMOptions = NonNullable<LLMSettings['options']>;
type FormSchema = Concrete<LLMOptions>;
type FormData = FormSchema;

interface IProps extends PropsWithChildren {
  options?: LLMOptions;
  onChange: (options: LLMOptions) => void;
}

export function LLMOptions(props: IProps) {
  const { options: propsOptions, onChange, children } = props;
  const [open, setOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      baseUrl: propsOptions?.baseUrl || '',
      apiKey: propsOptions?.apiKey || '',
      model: propsOptions?.model || '',
      temperature: propsOptions?.temperature || 1,
    },
  });

  const onSubmit = (data: FormData) => {
    onChange(data);
    toast.success('Options updated');
    setOpen(false);
  };

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-5/6 sm:max-w-md"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>Custom LLM Options</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://api.openai.com/v1/"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., gpt-4o" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[field.value]}
                        onValueChange={value => field.onChange(value[0])}
                        className="flex-1"
                      />
                      <span className="w-6 text-sm">
                        {field.value.toFixed(2)}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="!mt-6 flex justify-end">
              <Button type="submit" variant="outline" className="rounded">
                <SaveIcon size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
