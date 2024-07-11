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
import { LOCALE } from '@/types';

export function FormatterSettings() {
  const { locale } = useStore(state => state.settings.formatter);
  const updateFormatterSettings = useStore(
    state => state.updateFormatterSettings
  );

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="text-lg">Formatter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 md:gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Label className="text-base md:w-1/4 md:max-w-28">TMDB Locale</Label>
          <Select
            value={locale}
            onValueChange={value =>
              updateFormatterSettings({ locale: value as LOCALE })
            }
          >
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder={locale} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LOCALE.EN}>English ({LOCALE.EN})</SelectItem>
              <SelectItem value={LOCALE.ZH}>中文 ({LOCALE.ZH})</SelectItem>
              <SelectItem value={LOCALE.JP}>日本語 ({LOCALE.JP})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Label className="text-base md:w-1/4 md:max-w-28">Template</Label>
          <p>WIP</p>
        </div>
      </CardContent>
    </Card>
  );
}
