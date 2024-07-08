import { TaskDetailDialog } from './dialog';

export default function Page({ params }: { params: { tid: string } }) {
  return <TaskDetailDialog tid={+params.tid} />;
}
