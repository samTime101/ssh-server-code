import { useAuth } from "@/hooks/useAuth";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { usePhoneNumberReset } from "@/hooks/usePhoneNumberReset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Eye, EyeOff } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const passwordReset = usePasswordReset();
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
          <p className="text-muted-foreground mt-1 text-sm">
            Change your password and phone number
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Change Password Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Change Password</h3>
            <form
              onSubmit={passwordReset.handleSubmit(passwordReset.onSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="old_password"
                    type={passwordReset.showOldPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    {...passwordReset.register("old_password", {
                      required: "Current password is required",
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => passwordReset.setShowOldPassword(!passwordReset.showOldPassword)}
                  >
                    {passwordReset.showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordReset.errors.old_password && (
                  <FormErrorMessage message={passwordReset.errors.old_password.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={passwordReset.showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    {...passwordReset.register("new_password", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => passwordReset.setShowNewPassword(!passwordReset.showNewPassword)}
                  >
                    {passwordReset.showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordReset.errors.new_password && (
                  <FormErrorMessage message={passwordReset.errors.new_password.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_new_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_new_password"
                    type={passwordReset.showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    {...passwordReset.register("confirm_new_password", {
                      required: "Please confirm your new password",
                      validate: (value, formValues) =>
                        value === formValues.new_password || "Passwords do not match",
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() =>
                      passwordReset.setShowConfirmPassword(!passwordReset.showConfirmPassword)
                    }
                  >
                    {passwordReset.showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordReset.errors.confirm_new_password && (
                  <FormErrorMessage message={passwordReset.errors.confirm_new_password.message} />
                )}
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={passwordReset.loading}>
                {passwordReset.loading ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </div>

          <div className="border-t" />

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
