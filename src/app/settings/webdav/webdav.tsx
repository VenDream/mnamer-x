import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function WebDAVSettings() {
  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>WebDAV Settings</CardTitle>
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
