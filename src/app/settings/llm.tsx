import { LLMOptions } from '@/components/llm-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/store';
import { LLM_SOURCE } from '@/types';

export default function LLMSettings() {
  const { source, options } = useStore(state => state.settings.llm);
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
          <div className="flex items-center gap-4">
            <Label className="flex h-9 w-1/4 max-w-20 items-center text-base">
              Options
            </Label>
            <LLMOptions
              options={options}
              onChange={opts => updateLLMSettings({ options: opts })}
            >
              <Button variant="outline" className="rounded">
                Configure
              </Button>
            </LLMOptions>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
