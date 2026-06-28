import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePhoneNumberReset } from "@/hooks/usePhoneNumberReset";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormErrorMessage from "@/components/FormErrorMessage";

const SecuritySection: React.FC = () => {
  const { user } = useAuth();
  const phoneReset = usePhoneNumberReset();
  const passwordReset = usePasswordReset();

  return (
    <Card className="max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Security</CardTitle>
        <p className="text-muted-foreground mt-1 text-sm">Update your password and phone number</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="mb-6 text-lg font-semibold">Change Password</h3>
          <form onSubmit={passwordReset.handleSubmit(passwordReset.onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                type="password"
                placeholder="Enter your current password"
                {...passwordReset.register("old_password", {
                  required: "Current password is required",
                })}
              />
              {passwordReset.errors.old_password && (
                <FormErrorMessage message={passwordReset.errors.old_password.message} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="Enter your new password"
                {...passwordReset.register("new_password", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {passwordReset.errors.new_password && (
                <FormErrorMessage message={passwordReset.errors.new_password.message} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_new_password">Confirm New Password</Label>
              <Input
                id="confirm_new_password"
                type="password"
                placeholder="Confirm your new password"
                {...passwordReset.register("confirm_new_password", {
                  required: "Please confirm your new password",
                  validate: (value, formValues) =>
                    value === formValues.new_password || "Passwords do not match",
                })}
              />
              {passwordReset.errors.confirm_new_password && (
                <FormErrorMessage message={passwordReset.errors.confirm_new_password.message} />
              )}
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={passwordReset.loading}>
              {passwordReset.loading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </div>

        <div className="border-t pt-8">
          <h3 className="mb-6 text-lg font-semibold">Change Phone Number</h3>
          <form onSubmit={phoneReset.handleSubmit(phoneReset.onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_phone" className="text-muted-foreground">
                Current Phone Number
              </Label>
              <Input
                id="current_phone"
                type="text"
                value={user?.phonenumber ?? ""}
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
  );
};

export default SecuritySection;
