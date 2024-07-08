'use client';

import { TaskDetail } from '@/app/tasks/[tid]/task-detail';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@/store';
import { usePrevious } from 'ahooks';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IProps {
  tid: number;
}

export function TaskDetailDialog(props: IProps) {
  const router = useRouter();
  const task = useStore(state => state.tasks[props.tid]);
  const [open, setOpen] = useState(true);
  const prevOpen = usePrevious(open);

  const tLabel = dayjs(task.start).format('MMDDHHmm');

  useEffect(() => {
    if (prevOpen !== undefined && prevOpen === true && open === false) {
      router.back();
    }
  }, [open, prevOpen, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[70vh] max-w-[90vw] flex-col md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Task #{tLabel}</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar overflow-auto">
          <TaskDetail tid={props.tid} dialog />
        </div>
      </DialogContent>
    </Dialog>
  );
}
