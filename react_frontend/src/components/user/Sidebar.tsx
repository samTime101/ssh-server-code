import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Book,
  Stethoscope,
  Folder,
  FileText,
  User,
  Settings,
  LogOut,
  X,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Book, text: "Question Bank", path: "/userpanel/question-bank" },
  { icon: Stethoscope, text: "CEE Practice", path: "/userpanel/cee-practice" },
  { icon: Folder, text: "Case Studies", path: "/userpanel/case-studies" },
  { icon: FileText, text: "Mock Exams", path: "/userpanel/mock-exams" },
];

const otherItems = [
  { icon: User, text: "Profile", path: "/userpanel/profile", type: "link" },
  { icon: User, text: "History", path: "/userpanel/history", type: "link" },
  { icon: Bookmark, text: "Bookmarks", path: "/userpanel/bookmarks", type: "link" },
  { icon: Settings, text: "Settings", path: "/userpanel/settings", type: "link" },
  { icon: LogOut, text: "Logout", type: "button" },
];

const baseItemClass =
  "flex items-center gap-4 rounded-lg px-6 py-3 transition-all duration-200 cursor-pointer border border-transparent";
const activeClass = "bg-sidebar-primary text-sidebar-primary-foreground shadow-md";
const inactiveClass =
  "text-sidebar-foreground hover:bg-background hover:shadow-sm hover:border-border";
const iconActiveClass = "text-sidebar-primary-foreground";
const iconInactiveClass = "text-muted-foreground group-hover:text-sidebar-primary";

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => {
    if (path === "/userpanel/cee-practice") {
      return (
        location.pathname.startsWith("/userpanel/cee-practice") ||
        location.pathname.startsWith("/userpanel/cee-question")
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isOpen && (
        <div className="bg-foreground/20 fixed inset-0 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`border-sidebar-border bg-sidebar fixed top-[64px] left-0 z-40 flex h-[calc(100vh-64px)] w-64 flex-col border-r transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:z-10 md:translate-x-0`}
      >
        <div>
          <div className="mb-4 flex justify-end md:hidden">
            <button
              onClick={onClose}
              className="hover:bg-background rounded-lg p-2"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`${baseItemClass} ${active ? activeClass : inactiveClass}`}
                >
                  <IconComponent
                    size={20}
                    className={`${active ? iconActiveClass : iconInactiveClass} transition-colors duration-200`}
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            })}
          </ul>
        </nav>

        <div className="border-sidebar-border bg-sidebar flex-shrink-0 border-t px-3 py-6">
          {otherItems.map((item) => {
            const IconComponent = item.icon;
            if (item.type === "link" && item.path) {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`mt-2 ${baseItemClass} ${active ? activeClass : inactiveClass}`}
                >
                  <IconComponent
                    size={20}
                    className={active ? iconActiveClass : iconInactiveClass}
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            }
            // Logout button
            return (
              <button
                key={item.text}
                onClick={() => setShowLogoutModal(true)}
                className="text-destructive hover:border-destructive/20 hover:bg-destructive/10 mt-2 flex w-full items-center gap-4 rounded-lg border border-transparent px-6 py-3 transition-all duration-200 hover:shadow-sm"
              >
                <IconComponent size={20} className="text-destructive" />
                <p className="text-sm font-medium">{item.text}</p>
              </button>
            );
          })}
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

export default Sidebar;
