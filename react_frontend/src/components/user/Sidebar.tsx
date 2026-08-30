import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Book,
  Stethoscope,
  FileText,
  User,
  Settings,
  LogOut,
  X,
  Bookmark,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  Lock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useHasActiveSubscription } from "@/config/subscriptionAccess";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { icon: Book, text: "Question Bank", path: "/userpanel/question-bank", requiresSubscription: true },
  {
    icon: Stethoscope,
    text: "CEE Practice",
    path: "/userpanel/cee-practice",
    requiresSubscription: true,
  },
  { icon: FileText, text: "Mock Exams", path: "/userpanel/mock-exams", requiresSubscription: true },
];

const otherItems = [
  { icon: User, text: "Profile", path: "/userpanel/profile", type: "link" as const },
  {
    icon: History,
    text: "History",
    path: "/userpanel/history",
    type: "link" as const,
    requiresSubscription: true,
  },
  {
    icon: Bookmark,
    text: "Bookmarks",
    path: "/userpanel/bookmarks",
    type: "link" as const,
    requiresSubscription: true,
  },
  { icon: Settings, text: "Settings", path: "/userpanel/settings", type: "link" as const },
  { icon: LogOut, text: "Logout", type: "button" as const },
];

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) => {
  const { logout } = useAuth();
  const hasActiveSubscription = useHasActiveSubscription();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isLocked = (requiresSubscription?: boolean) =>
    Boolean(requiresSubscription) && !hasActiveSubscription;

  const isActive = (path: string) => {
    if (path === "/userpanel/cee-practice") {
      return (
        location.pathname.startsWith("/userpanel/cee-practice") ||
        location.pathname.startsWith("/userpanel/cee-question")
      );
    }
    return location.pathname.startsWith(path);
  };

  const baseItemClass = (active: boolean) =>
    cn(
      "flex items-center rounded-lg border border-transparent transition-all duration-200 cursor-pointer",
      isCollapsed ? "justify-center px-2 py-3" : "gap-4 px-6 py-3",
      active
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:shadow-sm"
    );

  const renderNavLink = (item: (typeof menuItems)[number]) => {
    const IconComponent = item.icon;
    const active = isActive(item.path);
    const locked = isLocked(item.requiresSubscription);
    const tooltipLabel = locked ? `${item.text} (locked)` : item.text;

    const link = (
      <Link key={item.path} to={item.path} onClick={onClose} className={baseItemClass(active)}>
        <IconComponent
          size={20}
          className={cn(
            "transition-colors duration-200",
            active ? "text-sidebar-primary-foreground" : "text-muted-foreground"
          )}
        />
        {!isCollapsed && <p className="flex-1 text-sm font-medium">{item.text}</p>}
        {!isCollapsed && locked && (
          <Lock
            size={14}
            className={active ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
          />
        )}
      </Link>
    );

    if (!isCollapsed) return link;

    return (
      <Tooltip key={item.path}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{tooltipLabel}</TooltipContent>
      </Tooltip>
    );
  };

  const renderBottomItem = (item: (typeof otherItems)[number]) => {
    const IconComponent = item.icon;

    if (item.type === "link" && item.path) {
      const active = isActive(item.path);
      const locked = isLocked(item.requiresSubscription);
      const tooltipLabel = locked ? `${item.text} (locked)` : item.text;
      const link = (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={cn("mt-2", baseItemClass(active))}
        >
          <IconComponent
            size={20}
            className={active ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
          />
          {!isCollapsed && <p className="flex-1 text-sm font-medium">{item.text}</p>}
          {!isCollapsed && locked && (
            <Lock
              size={14}
              className={active ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
            />
          )}
        </Link>
      );

      if (!isCollapsed) return link;

      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{tooltipLabel}</TooltipContent>
        </Tooltip>
      );
    }

    const logoutButton = (
      <button
        key={item.text}
        onClick={() => setShowLogoutModal(true)}
        className={cn(
          "text-destructive hover:border-destructive/20 hover:bg-destructive/10 mt-2 flex w-full items-center rounded-lg border border-transparent transition-all duration-200 hover:shadow-sm",
          isCollapsed ? "justify-center px-2 py-3" : "gap-4 px-6 py-3"
        )}
      >
        <IconComponent size={20} className="text-destructive" />
        {!isCollapsed && <p className="text-sm font-medium">{item.text}</p>}
      </button>
    );

    if (!isCollapsed) return logoutButton;

    return (
      <Tooltip key={item.text}>
        <TooltipTrigger asChild>{logoutButton}</TooltipTrigger>
        <TooltipContent side="right">{item.text}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="bg-foreground/20 fixed inset-0 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "border-sidebar-border bg-sidebar fixed top-[64px] left-0 z-40 flex h-[calc(100vh-64px)] flex-col border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {!isCollapsed && (
          <div className="mb-4 flex justify-end md:hidden">
            <button
              onClick={onClose}
              className="hover:bg-sidebar-accent rounded-lg p-2"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className={cn("flex flex-col gap-2", isCollapsed ? "px-2" : "px-3")}>
            {menuItems.map((item) => (
              <li key={item.path}>{renderNavLink(item)}</li>
            ))}
          </ul>
        </nav>

        <div
          className={cn(
            "border-sidebar-border bg-sidebar flex-shrink-0 border-t py-4",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          {otherItems.map((item) => renderBottomItem(item))}

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleCollapse}
                  className={cn("mt-2 w-full", baseItemClass(false))}
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen size={18} className="text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onToggleCollapse}
              className={cn("mt-2 w-full", baseItemClass(false))}
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} className="text-muted-foreground" />
              <p className="text-sm font-medium">Collapse sidebar</p>
            </button>
          )}
        </div>
      </aside>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent
          showCloseButton={false}
          className="z-[60] rounded-2xl border-0 px-8 pt-9 pb-7 shadow-2xl sm:max-w-[400px]"
        >
          <DialogHeader className="flex flex-col items-center gap-3 text-center">
            <div className="bg-destructive/10 mb-1 flex h-14 w-14 items-center justify-center rounded-full">
              <LogOut size={24} className="text-destructive" />
            </div>
            <DialogTitle className="text-lg font-bold">Log Out</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogoutModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-destructive-foreground flex-1"
              onClick={() => {
                setShowLogoutModal(false);
                onClose();
                logout();
              }}
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
