import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/auth";

interface MyProfileProps {
  user: User;
}

const MyProfile = ({ user }: MyProfileProps) => {
  const profileFields = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "First Name", value: user.first_name },
    { label: "Last Name", value: user.last_name },
    { label: "Phone Number", value: user.phonenumber },
    { label: "College", value: user.college },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold">
              {user?.first_name[0]}
              {user?.last_name[0]}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {user.first_name} {user.last_name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">{user.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {profileFields.map((field) => (
                <div key={field.label}>
                  <Label className="text-muted-foreground text-xs font-semibold uppercase">
                    {field.label}
                  </Label>
                  <p className="text-foreground">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Account Status</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Account Status
                </Label>
                <div className="mt-1">
                  <Badge variant={user.is_active ? "default" : "destructive"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-semibold uppercase">
                  Email Verified
                </Label>
                <div className="mt-1">
                  <Badge variant={user.is_email_verified ? "default" : "secondary"}>
                    {user.is_email_verified ? "Verified" : "Not Verified"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
