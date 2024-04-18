'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ProcessIcon, SettingsIcon } from '@/constants/custom-icons';
import { cn } from '@/lib/utils';
import {
  CounterClockwiseClockIcon,
  HomeIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavRoute {
  path: string;
  label: string;
  icon: typeof HomeIcon | React.FunctionComponent;
}

const NAV_ROUTES: NavRoute[] = [
  {
    path: '/',
    label: 'Getting Started',
    icon: HomeIcon,
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: ProcessIcon,
  },
  {
    path: '/history',
    label: 'History',
    icon: CounterClockwiseClockIcon,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: SettingsIcon,
  },
  {
    path: '/credits',
    label: 'Credits',
    icon: InfoCircledIcon,
  },
];

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full border-r">
      <div className="grid grid-flow-row gap-1 p-4">
        {NAV_ROUTES.map(({ path, label, icon: Icon }) => {
          const isActive = path === pathname;
          return (
            <Link
              key={path}
              href={path}
              className={cn(
                'flex items-center gap-2 rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800',
                {
                  'bg-slate-200': isActive,
                  'dark:bg-slate-800': isActive,
                  'cursor-default': isActive,
                }
              )}
            >
              <Icon></Icon>
              {label}
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
