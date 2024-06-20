import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/store';
import { LLM_SOURCE } from '@/types';
import { WrenchIcon } from 'lucide-react';
import { LLMOptions } from './llm-options';

export function LLMSettings() {
  const { source, options } = useStore(state => state.settings.llm);
  const updateLLMSettings = useStore(state => state.updateLLMSettings);

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>LLM</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 md:gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Label className="md:w-1/4 md:max-w-28">Source</Label>
          <RadioGroup
            value={source}
            defaultValue={LLM_SOURCE.BUILTIN}
            className="w-2/3 grid-flow-col gap-4 md:w-auto"
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Label className="md:w-1/4 md:max-w-28">Options</Label>
            <LLMOptions
              options={options}
              onChange={opts => updateLLMSettings({ options: opts })}
            >
              <Button variant="outline" className="rounded">
                <WrenchIcon size={16} className="mr-2" />
                Configure
              </Button>
            </LLMOptions>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
