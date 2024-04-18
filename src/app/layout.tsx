import { ModeToggle } from '@/components/mode-toggle';
import NavMenu from '@/components/nav-menu';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_META } from '@/constants';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon, Pencil2Icon } from '@radix-ui/react-icons';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ weight: '300', subsets: ['latin'] });
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
          inter.className,
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
            </div>
          </header>
          <article className="flex flex-1">
            <div className="hidden w-56 md:block">
              <NavMenu></NavMenu>
            </div>
            <div className="flex-1">{children}</div>
          </article>
        </ThemeProvider>
      </body>
    </html>
  );
}
