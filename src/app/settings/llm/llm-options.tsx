import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { LLMSettings } from '@/types';
import { SaveIcon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

type LLMOptions = LLMSettings['options'];

interface IProps extends PropsWithChildren {
  options: LLMOptions;
  onChange: (options: LLMOptions) => void;
}

export function LLMOptions(props: IProps) {
  const { options: propsOptions, onChange, children } = props;
  const [options, setOptions] = useState(propsOptions || {});

  const updateOption = (patch: Partial<LLMOptions>) => {
    setOptions(prev => ({ ...prev, ...patch }));
  };

  const saveOptions = () => {
    onChange(options);
  };

  const temperature =
    options.temperature === undefined ? 1 : options.temperature;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-5/6 sm:max-w-md"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="text-left">
          <SheetTitle>LLM Options</SheetTitle>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-4 md:gap-2">
          <Label htmlFor="baseUrl" className="flex h-9 items-center">
            Base URL
          </Label>
          <Input
            id="baseUrl"
            value={options.baseUrl}
            placeholder="e.g., https://api.openai.com/v1/"
            className="col-span-4 rounded md:col-span-3"
            onChange={e => updateOption({ baseUrl: e.target.value })}
          ></Input>
          <Label htmlFor="apiKey" className="flex h-9 items-center">
            API Key
          </Label>
          <Input
            id="apiKey"
            value={options.apiKey}
            placeholder="API Key"
            className="col-span-4 rounded md:col-span-3"
            onChange={e => updateOption({ apiKey: e.target.value })}
          ></Input>
          <Label htmlFor="model" className="flex h-9 items-center">
            Model
          </Label>
          <Input
            id="model"
            value={options.model}
            placeholder="e.g., gpt-4o"
            className="col-span-4 rounded md:col-span-3"
            onChange={e => updateOption({ model: e.target.value })}
          ></Input>
          <Label htmlFor="temperature" className="flex h-9 items-center">
            Temperature
          </Label>
          <div className="col-span-4 flex items-center gap-2 md:col-span-3">
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.05}
              value={[temperature]}
              className="flex-1"
              onValueChange={value => updateOption({ temperature: value[0] })}
            ></Slider>
            <span className="w-6 text-sm">{temperature.toFixed(2)}</span>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="mt-6 rounded"
              onClick={saveOptions}
            >
              <SaveIcon size={16} className="mr-2"></SaveIcon>
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
