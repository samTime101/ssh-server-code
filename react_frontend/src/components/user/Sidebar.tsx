import { useLocation, Link } from "react-router-dom";
import { Book, Stethoscope, Folder, FileText, User, Settings, LogOut, X, Bookmark } from "lucide-react";
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
        <div className="border-sidebar-border flex-shrink-0 border-b px-4 py-6">
          <div className="mb-4 flex justify-end md:hidden">
            <button
              onClick={onClose}
              className="hover:bg-background rounded-lg p-2"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <Link
            to="/userpanel"
            onClick={onClose}
            className="flex items-center justify-center gap-3"
          >
            <div
              className="flex shrink-0 items-center justify-center rounded-xl"
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <polyline
                  points="2,15 6,15 9,8 13,20 17,6 20,15 24,15"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span
                className="text-sidebar-primary text-xl font-bold tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Vaidix
              </span>
              <span
                className="text-muted-foreground block text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={{ marginTop: -2 }}
              >
                Medical MCQ Platform
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-3">
            {menuItems.map((item, idx) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={idx}
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
          {otherItems.map((item, idx) => {
            const IconComponent = item.icon;
            if (item.type === "link" && item.path) {
              const active = isActive(item.path);
              return (
                <Link
                  key={idx}
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
                key={idx}
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="text-destructive hover:border-destructive/20 hover:bg-destructive/10 mt-2 flex w-full items-center gap-4 rounded-lg border border-transparent px-6 py-3 transition-all duration-200 hover:shadow-sm"
              >
                <IconComponent size={20} className="text-destructive" />
                <p className="text-sm font-medium">{item.text}</p>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
