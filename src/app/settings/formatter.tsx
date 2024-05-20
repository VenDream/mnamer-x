import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FormatterSettings() {
  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>Formatter Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>settings content</p>
      </CardContent>
      <CardFooter>
        <p>footer</p>
      </CardFooter>
    </Card>
  );
}
