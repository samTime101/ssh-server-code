import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="border-border bg-sidebar sticky top-0 flex justify-between border-b px-8 py-4">
      <div className="header-left">
        <div className="header-logo">
          <img
            src="https://png.pngtree.com/png-vector/20250220/ourmid/pngtree-a-modern-heart-hand-medical-logo-design-vector-png-image_15511908.png"
            alt="Medical Logo"
            className="w-10"
          />
        </div>
      </div>
      <div className="header-right flex items-center gap-3 rounded-lg px-4 py-1">
        <div className="header-user-name">{user?.username}</div>
        <div className="header-user-picture bg-primary text-primary-foreground flex items-center justify-center rounded-full p-2 text-xs">
          {user?.first_name[0]}
          {user?.last_name[0]}
        </div>
      </div>
    </header>
  );
};

export default Header;
