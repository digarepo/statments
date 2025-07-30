import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function UITest() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">UI Components Test</h1>

      {/* ✅ Alert Test */}
      <Alert variant="default">
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>This is a test alert component.</AlertDescription>
      </Alert>

      {/* ✅ Button Variants */}
      <div className="space-x-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      {/* ✅ Card Component */}
      <Card>
        <CardHeader>
          <CardTitle>Card Component</CardTitle>
        </CardHeader>
        <CardContent>
          This is a card body. Add any content here.
        </CardContent>
      </Card>

      {/* ✅ Input + Label */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
    </div>
  );
}
