import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store';
import { LLM_SOURCE } from '@/types';

export default function LLMSettings() {
  const { source, settings } = useStore(state => state.settings.llm);
  const updateLLMSettings = useStore(state => state.updateLLMSettings);

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>LLM Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Label className="w-1/4 max-w-20 text-base">Source</Label>
          <RadioGroup
            value={source}
            defaultValue={LLM_SOURCE.BUILTIN}
            className="grid-flow-col gap-4"
            onValueChange={value =>
              updateLLMSettings({ source: value as LLM_SOURCE })
            }
          >
            <div className="flex cursor-pointer items-center space-x-2">
              <RadioGroupItem
                id={LLM_SOURCE.BUILTIN}
                value={LLM_SOURCE.BUILTIN}
              />
              <Label htmlFor={LLM_SOURCE.BUILTIN} className="cursor-pointer">
                Builtin
              </Label>
            </div>
            <div className="flex cursor-pointer items-center space-x-2">
              <RadioGroupItem
                id={LLM_SOURCE.CUSTOM}
                value={LLM_SOURCE.CUSTOM}
              />
              <Label htmlFor={LLM_SOURCE.CUSTOM} className="cursor-pointer">
                Custom
              </Label>
            </div>
          </RadioGroup>
        </div>
        {source === LLM_SOURCE.CUSTOM && (
          <div className="flex items-start gap-4">
            <Label className="flex h-9 w-1/4 max-w-20 items-center text-base">
              Options
            </Label>
            <div className="flex flex-1 flex-col gap-2">
              <Input
                value={settings?.baseUrl}
                placeholder="Base URL"
                className="w-full rounded md:w-1/2 md:min-w-[350px]"
                onChange={e => {
                  updateLLMSettings({ settings: { baseUrl: e.target.value } });
                }}
              ></Input>
              <Input
                value={settings?.apiPath}
                placeholder="API Path"
                className="w-full rounded md:w-1/2 md:min-w-[350px]"
                onChange={e => {
                  updateLLMSettings({ settings: { apiPath: e.target.value } });
                }}
              ></Input>
              <Input
                value={settings?.apiKey}
                placeholder="API Key"
                className="w-full rounded md:w-1/2 md:min-w-[350px]"
                onChange={e => {
                  updateLLMSettings({ settings: { apiKey: e.target.value } });
                }}
              ></Input>
              <Input
                value={settings?.model}
                placeholder="Model"
                className="w-full rounded md:w-1/2 md:min-w-[350px]"
                onChange={e => {
                  updateLLMSettings({ settings: { model: e.target.value } });
                }}
              ></Input>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[settings?.temperature || 1]}
                className="mt-2 w-full md:w-1/2 md:min-w-[350px]"
                onValueChange={value => {
                  updateLLMSettings({ settings: { temperature: value[0] } });
                }}
              ></Slider>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
