import { ModeToggle } from '@/components/mode-toggle';
import { NavMenu, NavMenuForMobile } from '@/components/nav-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { GITHUB_REPO, ROUTE, SITE_META } from '@/constants';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { FilePenLineIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const font = Inter({ subsets: ['latin'], weight: '300' });
const title = SITE_META.title as string;

export const metadata: Metadata = SITE_META;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          font.className,
          'flex h-screen w-screen flex-col overflow-hidden'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky flex h-16 shrink-0 justify-between border-b px-4 py-2">
            <Link href={ROUTE.INDEX}>
              <div className="flex h-full flex-col justify-center">
                <h1 className="text-lg font-bold">{title.toUpperCase()}</h1>
                <p className="hidden gap-1 text-xs md:flex">
                  <FilePenLineIcon size={16}></FilePenLineIcon>
                  {SITE_META.description}
                </p>
              </div>
            </Link>
            <div className="group flex h-full items-center justify-center gap-4">
              <Link
                target="_blank"
                href={GITHUB_REPO}
                className="flex h-9 w-9 cursor-pointer items-center justify-center"
              >
                <Button size="icon" variant="outline">
                  <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]"></GitHubLogoIcon>
                </Button>
              </Link>
              <ModeToggle></ModeToggle>
              <div className="block md:hidden">
                <NavMenuForMobile></NavMenuForMobile>
              </div>
            </div>
          </header>
          <main className="flex min-h-0 flex-1">
            <div className="hidden w-56 shrink-0 md:block">
              <ScrollArea className="h-full border-r">
                <NavMenu></NavMenu>
              </ScrollArea>
            </div>
            <div className="flex-1">
              <ScrollArea className="h-full">{children}</ScrollArea>
            </div>
          </main>
          <Toaster
            toastOptions={{
              className: 'text-xs md:text-sm py-3 px-4 rounded-sm items-start',
              classNames: {
                icon: 'positive top-[3px]',
                content: font.className,
              },
            }}
            richColors
            position="top-center"
          ></Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
