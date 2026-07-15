import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import MyProfile from "@/components/profile/MyProfile";
import MyStatistics from "@/components/profile/MyStatistics";
import MySuggestedQuestions from "@/components/profile/MySuggestedQuestions";
import MySubscriptions from "@/components/profile/MySubscriptions";

type TabType = "profile" | "statistics" | "questions" | "subscriptions";

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const tabs = [
    { id: "profile" as TabType, label: "My Profile" },
    { id: "statistics" as TabType, label: "My Statistics" },
    { id: "questions" as TabType, label: "My Suggested Questions" },
    { id: "subscriptions" as TabType, label: "My Subscriptions" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyProfile user={user} />;
      case "statistics":
        return <MyStatistics user={user} />;
      case "questions":
        return <MySuggestedQuestions />;
      case "subscriptions":
        return <MySubscriptions />;
      default:
        return <MyProfile user={user} />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-4xl">
        <nav className="border-b">
          <div className="flex flex-wrap gap-2 sm:gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-colors
                  hover:text-primary focus:outline-none
                  ${
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
      <div className="max-w-4xl">{renderTabContent()}</div>
    </div>
  );
};

export default ProfilePage;
