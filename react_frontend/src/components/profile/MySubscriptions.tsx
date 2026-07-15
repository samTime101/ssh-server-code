import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MySubscriptions = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">My Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg">This section is under development</p>
            <p className="mt-2 text-sm">Your subscriptions will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubscriptions;
