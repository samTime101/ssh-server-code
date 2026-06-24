import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AppearanceSection: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card className="max-w-4xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Appearance</CardTitle>
        <p className="text-muted-foreground mt-1 text-sm">
          Customize how the application looks on your screen
        </p>
      </CardHeader>
      <CardContent className="divide-y">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Dark Mode</h3>
            <p className="text-muted-foreground text-sm">Switch between light and dark themes</p>
          </div>

          {/* Sliding Toggle Switch */}
          <button
            role="switch"
            aria-checked={theme === "dark"}
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              theme === "dark" ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-md ring-0 transition-transform ${
                theme === "dark" ? "translate-x-5" : "translate-x-0.5"
              }`}
            >
              {theme === "dark" ? (
                <Moon className="h-3 w-3 text-primary" />
              ) : (
                <Sun className="h-3 w-3 text-amber-500" />
              )}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSection;
