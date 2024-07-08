import { Metadata } from 'next';
import { TaskDetail } from './task-detail';

export default function Page({ params }: { params: { tid: string } }) {
  return <TaskDetail tid={+params.tid} />;
}

export const metadata: Metadata = {
  title: 'Task Detail',
};
