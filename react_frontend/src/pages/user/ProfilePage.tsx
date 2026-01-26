import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/Loader";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const profileFields = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "First Name", value: user.first_name },
    { label: "Last Name", value: user.last_name },
    { label: "Phone Number", value: user.phonenumber },
    { label: "College", value: user.college },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#323A67] text-lg font-semibold text-white">
                {user?.first_name[0]}
                {user?.last_name[0]}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {user.first_name} {user.last_name}
                </CardTitle>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {profileFields.map((field) => (
                  <div key={field.label}>
                    <Label className="text-xs font-semibold text-gray-600 uppercase">
                      {field.label}
                    </Label>
                    <p className="text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Account Status</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Account Status
                  </Label>
                  <div className="mt-1">
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
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

            {user.roles && user.roles.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold">Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-4 text-lg font-semibold">Performance Statistics</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Total Attempts
                  </Label>
                  <p className="text-2xl font-bold text-gray-900">{user.total_attempts}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Correct Answers
                  </Label>
                  <p className="text-2xl font-bold text-green-600">{user.total_right_attempts}</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">Accuracy</Label>
                  <p className="text-2xl font-bold text-blue-600">{user.accuracy_percent}%</p>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 uppercase">
                    Completion
                  </Label>
                  <p className="text-2xl font-bold text-purple-600">{user.completion_percent}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
