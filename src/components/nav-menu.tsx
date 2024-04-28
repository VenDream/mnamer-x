'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProcessIcon, SettingsIcon } from '@/constants/custom-icons';
import { cn } from '@/lib/utils';
import {
  CounterClockwiseClockIcon,
  HamburgerMenuIcon,
  HomeIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
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

export function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="grid grid-flow-row gap-1 p-4">
      {NAV_ROUTES.map(({ path, label, icon: Icon }) => {
        const isActive = path === pathname;
        return (
          <Link
            key={path}
            href={path}
            className={cn(
              'flex items-center gap-2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800',
              {
                'bg-slate-100': isActive,
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
  );
}

export function NavMenuForMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <HamburgerMenuIcon></HamburgerMenuIcon>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {NAV_ROUTES.map(({ path, label, icon: Icon }) => {
          return (
            <DropdownMenuItem key={path} onClick={() => setIsMenuOpen(false)}>
              <Link
                href={path}
                className={cn('flex w-full items-center gap-1 rounded-md')}
              >
                <Icon className="mr-1"></Icon>
                {label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
