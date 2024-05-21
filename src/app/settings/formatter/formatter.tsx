import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store';

export function FormatterSettings() {
  const { language } = useStore(state => state.settings.formatter);
  const updateFormatterSettings = useStore(
    state => state.updateFormatterSettings
  );

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>Formatter Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Label className="w-1/4 max-w-20 text-base">Language</Label>
          <Select
            value={language}
            onValueChange={value =>
              updateFormatterSettings({ language: value })
            }
          >
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder={language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English</SelectItem>
              <SelectItem value="zh-CN">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-1/4 max-w-20 text-base">Template</Label>
          <p>WIP</p>
        </div>
      </CardContent>
    </Card>
  );
}
