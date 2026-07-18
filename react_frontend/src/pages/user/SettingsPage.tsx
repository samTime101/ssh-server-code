import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import AppearanceSection from "@/components/AppearanceSection";
import SecuritySection from "@/components/SecuritySection";

const SettingsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-foreground text-2xl font-semibold">Settings</h1>
      <AppearanceSection />
      <SecuritySection />
    </div>
  );
};

export default SettingsPage;
