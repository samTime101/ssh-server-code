import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TeacherPanel() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Teacher Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the teacher panel.</p>
        </CardContent>
      </Card>
    </div>
  )
}
