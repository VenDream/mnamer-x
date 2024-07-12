import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useState } from 'react';

interface IProps extends React.PropsWithChildren {
  title: string;
  desc?: string;
  className?: string;
}

export function SettingsCard(props: IProps) {
  const { title, desc } = props;
  const [expand, setExpand] = useState(false);

  return (
    <Card className="rounded">
      <Accordion type="single" collapsible>
        <AccordionItem value="settings-card" className="border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{title}</CardTitle>
              <AccordionPrimitive.Trigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? 'Collapse' : 'Expand'}
                </Button>
              </AccordionPrimitive.Trigger>
            </div>
            {desc && <CardDescription>{desc}</CardDescription>}
          </CardHeader>
          <AccordionContent className="pb-0 pt-1">
            <CardContent
              className={cn('flex flex-col gap-8 md:gap-4', props.className)}
            >
              {props.children}
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
