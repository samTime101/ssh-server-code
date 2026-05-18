import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initials = user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.trim() : "";
  return (
    <header className="border-border bg-sidebar sticky top-0 z-50 flex justify-between border-b px-8 py-4">
      <div className="header-left">
        <Link
          to="/userpanel"
          // onClick={onClose}
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
      {user && (
        <div className="header-right flex items-center gap-3 rounded-lg px-4 py-1">
          {user?.roles?.includes("ADMIN") && (
            <Button onClick={() => navigate("/admin")}>Admin Panel</Button>
          )}
          <div className="header-user-name">{user?.username}</div>
          <div className="header-user-picture bg-primary text-primary-foreground flex items-center justify-center rounded-full p-2 text-xs">
            {initials}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
