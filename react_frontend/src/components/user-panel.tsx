import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UserPanel() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>User Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the user panel.</p>
        </CardContent>
      </Card>
    </div>
  )
}
