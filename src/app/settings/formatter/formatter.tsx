import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store';
import { LOCALE } from '@/types';
import { SettingsBlock } from '../settings-block';
import { SettingsCard } from '../settings-card';

export function FormatterSettings() {
  const { locale } = useStore(state => state.settings.formatter);
  const updateFormatterSettings = useStore(
    state => state.updateFormatterSettings
  );

  return (
    <SettingsCard title="Formatter" desc="Edit TMDB locale & naming template">
      <SettingsBlock label="TMDB Locale">
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
      </SettingsBlock>
      <SettingsBlock label="Template">
        <p>WIP</p>
      </SettingsBlock>
    </SettingsCard>
  );
}
