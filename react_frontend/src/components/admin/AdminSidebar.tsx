import { Settings, LogOut, X, ChevronDown, ChevronRight, FolderOpen, BookOpen } from "lucide-react";
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
  currentPath,
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
            const isActive = currentPath === item.path;

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
  const {
    currentPath,
    visibleTopItems,
    visibleBottomItems,
    visibleQuestionItems,
    visibleCategoryItems,
    isQuestionGroupActive,
    isCategoryGroupActive,
    questionsOpen,
    categoriesOpen,
    toggleQuestions,
    toggleCategories,
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
              const isActive = currentPath === item.path;

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
                currentPath={currentPath}
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
                currentPath={currentPath}
              />
            )}

            {visibleBottomItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPath === item.path;

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
            onClick={logout}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200"
          >
            <LogOut size={18} className="text-destructive" />
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
