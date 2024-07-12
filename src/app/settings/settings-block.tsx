import { Label } from '@/components/ui/label';

interface IProps extends React.PropsWithChildren {
  label: string;
}

export function SettingsBlock(props: IProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Label className="text-base md:w-1/4 md:max-w-28">{props.label}</Label>
      {props.children}
    </div>
  );
}
