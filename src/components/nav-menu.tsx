'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ROUTE } from '@/constants';
import { cn } from '@/lib/utils';
import {
  BotIcon,
  HistoryIcon,
  HomeIcon,
  InfoIcon,
  MenuIcon,
  Settings2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavRoute {
  path: string;
  label: string;
  icon: typeof HomeIcon | React.FunctionComponent;
}

const NAV_ROUTES: NavRoute[] = [
  {
    path: ROUTE.INDEX,
    label: 'Home',
    icon: HomeIcon,
  },
  {
    path: ROUTE.TASKS,
    label: 'Tasks',
    icon: BotIcon,
  },
  {
    path: ROUTE.HISTORY,
    label: 'History',
    icon: HistoryIcon,
  },
  {
    path: ROUTE.SETTINGS,
    label: 'Settings',
    icon: Settings2Icon,
  },
  {
    path: ROUTE.CREDITS,
    label: 'Credits',
    icon: InfoIcon,
  },
];

export function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="grid grid-flow-row gap-1 p-4">
      {NAV_ROUTES.map(({ path, label, icon: Icon }) => {
        const isActive =
          path === '/' ? path === pathname : pathname.startsWith(path);
        return (
          <Link
            key={path}
            href={path}
            className={cn(
              'flex items-center gap-2 rounded-md p-2 hover:bg-accent',
              {
                'bg-accent': isActive,
                'cursor-default': isActive,
              }
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function NavMenuForMobile() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon size={16} className="text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Menu</SheetTitle>
        <div className="mt-6 space-y-2">
          {NAV_ROUTES.map(({ path, label, icon: Icon }) => {
            const isActive = path === pathname;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex w-full items-center gap-1 rounded-md border p-2',
                  'rounded-sm shadow-sm',
                  {
                    'bg-accent': isActive,
                    'cursor-default': isActive,
                  }
                )}
              >
                <Icon size={16} className="mr-2" />
                {label}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
