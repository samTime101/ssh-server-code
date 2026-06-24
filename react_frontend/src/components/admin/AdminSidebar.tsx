import { useState } from "react";
import {
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  BookOpen,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";
import type { AdminSidebarProps, CollapsibleNavGroupProps, NavItem } from "@/types/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navButtonClass = (isActive: boolean, isCollapsed: boolean) =>
  cn(
    "flex items-center rounded-lg transition-all duration-200",
    isCollapsed ? "justify-center px-2 py-3" : "gap-4 px-4 py-3",
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
      : "text-sidebar-foreground hover:bg-sidebar-accent"
  );

const CollapsedNavLink = ({
  item,
  isActive,
  onNavClick,
}: {
  item: NavItem;
  isActive: boolean;
  onNavClick: () => void;
}) => {
  const ItemIcon = item.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={item.path} onClick={onNavClick} className={navButtonClass(isActive, true)}>
          <ItemIcon
            size={18}
            className={isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.text}</TooltipContent>
    </Tooltip>
  );
};

const CollapsibleNavGroup = ({
  icon: GroupIcon,
  label,
  items,
  isGroupActive,
  isOpen,
  isCollapsed,
  onToggle,
  onNavClick,
  isPathActive,
}: CollapsibleNavGroupProps) => {
  const chevronClass = isGroupActive ? "text-sidebar-primary-foreground" : "text-muted-foreground";

  if (isCollapsed) {
    return (
      <li>
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button className={cn(navButtonClass(isGroupActive, true), "w-full")}>
                  <GroupIcon
                    size={18}
                    className={
                      isGroupActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                    }
                  />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
          <PopoverContent side="right" align="start" className="w-52 p-2">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wide uppercase">
              {label}
            </p>
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const ItemIcon = item.icon;
                const isActive = isPathActive(item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onNavClick}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <ItemIcon size={15} />
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </li>
    );
  }

  return (
    <li className="flex flex-col">
      <button onClick={onToggle} className={navButtonClass(isGroupActive, false)}>
        <GroupIcon
          size={18}
          className={isGroupActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
        />
        <p className="flex-1 text-left text-sm font-medium">{label}</p>
        {isOpen ? (
          <ChevronDown size={16} className={chevronClass} />
        ) : (
          <ChevronRight size={16} className={chevronClass} />
        )}
      </button>

      {isOpen && (
        <ul className="mt-1 flex flex-col gap-1 pl-4">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = isPathActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <ItemIcon
                  size={15}
                  className={isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
                />
                <span className="font-medium">{item.text}</span>
              </Link>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {
    isPathActive,
    visibleTopItems,
    visibleBottomItems,
    visibleQuestionItems,
    visibleCategoryItems,
    visibleFeedbackItems,
    isQuestionGroupActive,
    isCategoryGroupActive,
    isFeedbackGroupActive,
    questionsOpen,
    categoriesOpen,
    feedbackOpen,
    toggleQuestions,
    toggleCategories,
    toggleFeedback,
  } = useAdminSidebar();

  const renderNavLink = (item: NavItem) => {
    const IconComponent = item.icon;
    const isActive = isPathActive(item.path);

    if (isCollapsed) {
      return (
        <CollapsedNavLink key={item.path} item={item} isActive={isActive} onNavClick={onClose} />
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={navButtonClass(isActive, false)}
      >
        <IconComponent
          size={18}
          className={isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"}
        />
        <p className="text-sm font-medium">{item.text}</p>
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div className="bg-foreground/20 fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "border-sidebar-border bg-sidebar fixed top-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "border-sidebar-border flex-shrink-0 border-b py-6",
            isCollapsed ? "px-2" : "px-6"
          )}
        >
          <div
            className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}
          >
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              <div className="bg-sidebar-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <span className="text-sidebar-primary-foreground text-sm font-bold">A</span>
              </div>
              {!isCollapsed && (
                <h2 className="text-sidebar-foreground text-lg font-semibold">Admin Panel</h2>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={onClose}
                className="hover:bg-sidebar-accent rounded-lg p-2 lg:hidden"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className={cn("flex flex-col gap-2", isCollapsed ? "px-2" : "px-4")}>
            {visibleTopItems.map((item) => (
              <li key={item.path}>{renderNavLink(item)}</li>
            ))}

            {visibleQuestionItems.length > 0 && (
              <CollapsibleNavGroup
                icon={BookOpen}
                label="Questions"
                items={visibleQuestionItems}
                isGroupActive={isQuestionGroupActive}
                isOpen={questionsOpen}
                isCollapsed={isCollapsed}
                onToggle={toggleQuestions}
                onNavClick={onClose}
                isPathActive={isPathActive}
              />
            )}

            {visibleCategoryItems.length > 0 && (
              <CollapsibleNavGroup
                icon={FolderOpen}
                label="Categories"
                items={visibleCategoryItems}
                isGroupActive={isCategoryGroupActive}
                isOpen={categoriesOpen}
                isCollapsed={isCollapsed}
                onToggle={toggleCategories}
                onNavClick={onClose}
                isPathActive={isPathActive}
              />
            )}

            {visibleFeedbackItems.length > 0 && (
              <CollapsibleNavGroup
                icon={MessageCircle}
                label="Feedback"
                items={visibleFeedbackItems}
                isGroupActive={isFeedbackGroupActive}
                isOpen={feedbackOpen}
                isCollapsed={isCollapsed}
                onToggle={toggleFeedback}
                onNavClick={onClose}
                isPathActive={isPathActive}
              />
            )}

            {visibleBottomItems.map((item) => (
              <li key={item.path}>{renderNavLink(item)}</li>
            ))}
          </ul>
        </nav>

        <div
          className={cn(
            "border-sidebar-border flex-shrink-0 space-y-2 border-t py-4",
            isCollapsed ? "px-2" : "px-4"
          )}
        >
          {isCollapsed ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/admin/settings"
                    onClick={onClose}
                    className={navButtonClass(isPathActive("/admin/settings"), true)}
                  >
                    <Settings
                      size={18}
                      className={
                        isPathActive("/admin/settings")
                          ? "text-sidebar-primary-foreground"
                          : "text-muted-foreground"
                      }
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center justify-center rounded-lg px-2 py-3 transition-all duration-200"
                  >
                    <LogOut size={18} className="text-destructive" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Link
                to="/admin/settings"
                onClick={onClose}
                className={navButtonClass(isPathActive("/admin/settings"), false)}
              >
                <Settings
                  size={18}
                  className={
                    isPathActive("/admin/settings")
                      ? "text-sidebar-primary-foreground"
                      : "text-muted-foreground"
                  }
                />
                <p className="text-sm font-medium">Settings</p>
              </Link>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200"
              >
                <LogOut size={18} className="text-destructive" />
                <p className="text-sm font-medium">Logout</p>
              </button>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleCollapse}
                className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground flex w-full items-center justify-center rounded-lg px-2 py-2 transition-all duration-200"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.15s ease",
          }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: "var(--background, #fff)",
              borderRadius: "16px",
              padding: "36px 32px 28px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              animation: "slideUp 0.2s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <LogOut size={24} color="#ef4444" />
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--foreground, #111)",
              }}
            >
              Log Out
            </h2>

            <p
              style={{
                margin: "4px 0 16px",
                fontSize: "0.925rem",
                color: "var(--muted-foreground, #666)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to log out?
            </p>

            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1.5px solid var(--border, #e5e7eb)",
                  background: "transparent",
                  color: "var(--foreground, #111)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted, #f3f4f6)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onClose();
                  logout();
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
              >
                Log Out
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          `}</style>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
