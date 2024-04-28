'use client';

import { Button } from '@/components/ui/button';
import { useStore } from '@/store';

export default function History() {
  const tasks = useStore(state => state.history);

  return (
    <div className="flex h-full w-full p-4">
      <Button variant="outline">Total Tasks: {tasks.length}</Button>
    </div>
  );
}
