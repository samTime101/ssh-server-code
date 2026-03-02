import { useLocation, Link } from "react-router-dom";
import { Book, Stethoscope, Folder, FileText, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: Book, text: "Question Bank", path: "/userpanel/question-bank" },
  { icon: Stethoscope, text: "CEE Practice", path: "/userpanel/cee-practice" },
  { icon: Folder, text: "Case Studies", path: "/userpanel/case-studies" },
  { icon: FileText, text: "Mock Exams", path: "/userpanel/mock-exams" },
];

const otherItems = [
  { icon: User, text: "Profile", path: "/userpanel/profile", type: "link" },
  { icon: User, text: "History", path: "/userpanel/history", type: "link" },
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

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="border-sidebar-border bg-sidebar fixed top-[64px] left-0 z-10 flex h-[calc(100vh-64px)] w-64 flex-col border-r">
      <div className="border-sidebar-border flex-shrink-0 border-b px-4 py-6">
        <h2 className="text-sidebar-primary text-center text-xl font-bold">SISANI-EPS</h2>
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
                className={`mt-2 ${baseItemClass} ${active ? activeClass : inactiveClass}`}
              >
                <IconComponent size={20} className={active ? iconActiveClass : iconInactiveClass} />
                <p className="text-sm font-medium">{item.text}</p>
              </Link>
            );
          }
          // Logout button
          return (
            <button
              key={idx}
              onClick={logout}
              className="text-destructive hover:border-destructive/20 hover:bg-destructive/10 mt-2 flex w-full items-center gap-4 rounded-lg border border-transparent px-6 py-3 transition-all duration-200 hover:shadow-sm"
            >
              <IconComponent size={20} className="text-destructive" />
              <p className="text-sm font-medium">{item.text}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
