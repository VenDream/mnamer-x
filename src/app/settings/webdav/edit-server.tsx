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
import { testConnection } from '@/lib/webdav-client';
import { useStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { CableIcon, SaveIcon } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .max(10, { message: 'Name should be no more than 10 characters' }),
  remoteURL: z
    .string()
    .min(1, { message: 'Remote URL is required' })
    .url({ message: 'Invalid URL' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormSchema = z.infer<typeof formSchema>;
type FormData = FormSchema;

interface IProps extends PropsWithChildren {
  id?: number;
}

export function EditServer(props: IProps) {
  const { id, children } = props;
  const [open, setOpen] = useState(false);
  const webdav = useStore(state => state.settings.webdav[id || 0]);
  const addWebDAV = useStore(state => state.addWebDAV);
  const updateWebDAVSettings = useStore(state => state.updateWebDAVSettings);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: webdav?.name || '',
      remoteURL: webdav?.remoteURL || '',
      username: webdav?.username || '',
      password: webdav?.password || '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (id) {
      updateWebDAVSettings(id, data);
      toast.success('Settings updated');
    } else {
      const id = Date.now();
      const name = data.name || `Server #${dayjs().format('HHmm')}`;
      addWebDAV({ ...data, id, name });
      toast.success('WebDAV server added');
    }

    setOpen(false);
  };

  const testServer = async () => {
    const opts = form.getValues();
    const isValid = await form.trigger();
    const loadingMsg = 'Testing WebDAV connection...';

    isValid &&
      toast.promise(
        new Promise<boolean>((resolve, reject) => {
          testConnection(opts).then(r => (r ? resolve(r) : reject()));
        }),
        {
          loading: loadingMsg,
          success: loadingMsg + 'OK',
          error: loadingMsg + 'Failed',
        }
      );
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
          <SheetTitle>{id ? 'Edit' : 'Add'} WebDAV Server</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My WebDAV Server" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remoteURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remote URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://webdav.your-server.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username for authentication"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="password for authentication"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="!mt-6 flex justify-between">
              <Button
                type="submit"
                variant="outline"
                onClick={async e => {
                  e.preventDefault();
                  testServer();
                }}
              >
                <CableIcon size={16} className="mr-2" />
                Test
              </Button>
              <Button type="submit" variant="outline">
                <SaveIcon size={16} className="mr-2" />
                {id ? 'Save' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
