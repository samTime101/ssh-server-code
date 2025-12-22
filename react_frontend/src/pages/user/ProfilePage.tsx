import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    { label: "Email", value: user.email },
  ];

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
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
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label}>
                <Label className="text-xs font-semibold uppercase text-gray-600">
                  {field.label}
                </Label>
                <p className="mt-2 text-lg text-gray-900">{field.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;