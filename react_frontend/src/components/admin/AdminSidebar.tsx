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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";
import type { AdminSidebarProps, CollapsibleNavGroupProps } from "@/types/sidebar";

const CollapsibleNavGroup = ({
  icon: GroupIcon,
  label,
  items,
  isGroupActive,
  isOpen,
  onToggle,
  onNavClick,
  isPathActive,
}: CollapsibleNavGroupProps) => {
  const chevronClass = isGroupActive ? "text-sidebar-primary-foreground" : "text-muted-foreground";

  return (
    <li className="flex flex-col">
      <button
        onClick={onToggle}
        className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
          isGroupActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground hover:bg-sidebar-accent"
        }`}
      >
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
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
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

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="bg-foreground/20 fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`border-sidebar-border bg-sidebar fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-10 lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="border-sidebar-border flex-shrink-0 border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-sidebar-primary-foreground text-sm font-bold">A</span>
              </div>
              <h2 className="text-sidebar-foreground text-lg font-semibold">Admin Panel</h2>
            </div>
            <button onClick={onClose} className="hover:bg-sidebar-accent rounded-lg p-2 lg:hidden">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-4">
            {visibleTopItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <IconComponent
                    size={18}
                    className={
                      isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                    }
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            })}

            {visibleQuestionItems.length > 0 && (
              <CollapsibleNavGroup
                icon={BookOpen}
                label="Questions"
                items={visibleQuestionItems}
                isGroupActive={isQuestionGroupActive}
                isOpen={questionsOpen}
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
                onToggle={toggleFeedback}
                onNavClick={onClose}
                isPathActive={isPathActive}
              />
            )}

            {visibleBottomItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isPathActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <IconComponent
                    size={18}
                    className={
                      isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                    }
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-sidebar-border flex-shrink-0 space-y-2 border-t px-4 py-4">
          <div className="text-sidebar-foreground hover:bg-sidebar-accent flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200">
            <Settings size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium">Settings</p>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200"
          >
            <LogOut size={18} className="text-destructive" />
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
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
            {/* Icon */}
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

            {/* Title */}
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

            {/* Message */}
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

            {/* Buttons */}
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
