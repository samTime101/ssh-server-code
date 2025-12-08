import { useAuth } from "@/hooks/useAuth";


const Header = () => {
  const { user } = useAuth();
  return (
    <header className="flex justify-between px-8 py-4 border-b">
      <div className="header-left">
        <div className="header-logo">
          <img
            src="https://png.pngtree.com/png-vector/20250220/ourmid/pngtree-a-modern-heart-hand-medical-logo-design-vector-png-image_15511908.png"
            alt="Medical Logo"
            className="w-10"
          />
        </div>
      </div>
      <div className="header-right flex gap-3 px-4 py-1 rounded-lg items-center">
        <div className="header-user-name">{user?.username}</div>
        <div className="header-user-picture bg-[#323A67] rounded-full p-2 flex justify-center items-center text-xs text-white">
          {user?.first_name[0]}{user?.last_name[0]}
        </div>
      </div>
    </header>
  );
};

export default Header;
