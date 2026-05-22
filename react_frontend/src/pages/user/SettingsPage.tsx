import { useAuth } from "@/hooks/useAuth";
import { usePhoneNumberReset } from "@/hooks/usePhoneNumberReset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import FormErrorMessage from "@/components/FormErrorMessage";

const SettingsPage = () => {
  const { user } = useAuth();
  const phoneReset = usePhoneNumberReset();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Security Settings Card */}
      <Card className="max-w-4xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Security</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">Update your phone number</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Change Phone Number Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Change Phone Number</h3>
            <form onSubmit={phoneReset.handleSubmit(phoneReset.onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_phone" className="text-muted-foreground">
                  Current Phone Number
                </Label>
                <Input
                  id="current_phone"
                  type="text"
                  value={user.phonenumber}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_phonenumber">New Phone Number</Label>
                <Input
                  id="new_phonenumber"
                  type="text"
                  placeholder="Enter your new phone number"
                  {...phoneReset.register("new_phonenumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                />
                {phoneReset.errors.new_phonenumber && (
                  <FormErrorMessage message={phoneReset.errors.new_phonenumber.message} />
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={phoneReset.loading}>
                {phoneReset.loading ? "Updating Phone..." : "Update Phone Number"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
