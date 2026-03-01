import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-sidebar border-border border-b px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left Section - Hamburger and Title */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile Only) */}
          <button onClick={onMenuClick} className="hover:bg-muted rounded-lg p-2 lg:hidden">
            <Menu size={20} className="text-muted-foreground" />
          </button>

          <h1 className="text-foreground text-lg font-semibold lg:text-xl">Admin Dashboard</h1>
        </div>

        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Notifications */}
          <button className="text-muted-foreground hover:text-foreground hover:bg-muted relative rounded-lg p-2 transition-colors">
            <Bell size={18} />
            <span className="bg-destructive text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs">
              3
            </span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-foreground text-sm font-medium">{user?.username}</div>
              <div className="text-muted-foreground text-xs">Administrator</div>
            </div>
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full lg:h-10 lg:w-10">
              <span className="text-primary-foreground text-xs font-semibold lg:text-sm">
                {user?.first_name[0]}
                {user?.last_name[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
