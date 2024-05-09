import { ModeToggle } from '@/components/mode-toggle';
import { NavMenu, NavMenuForMobile } from '@/components/nav-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { SITE_META } from '@/constants';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon, Pencil2Icon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const font = Inter_Tight({ subsets: ['latin'] });
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
            <div className="flex h-full flex-col justify-center">
              <h1 className="text-lg font-bold">{title.toUpperCase()}</h1>
              <p className="hidden gap-1 text-xs md:flex">
                <Pencil2Icon></Pencil2Icon>
                {SITE_META.description}
              </p>
            </div>
            <div className="group flex h-full items-center justify-center gap-4">
              <Link
                target="_blank"
                href="https://github.com/VenDream/mnamer-x"
                className="flex h-9 w-9 cursor-pointer items-center justify-center"
              >
                <GitHubLogoIcon className="h-[1.4rem] w-[1.4rem]"></GitHubLogoIcon>
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
                icon: 'positive top-[1px]',
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
