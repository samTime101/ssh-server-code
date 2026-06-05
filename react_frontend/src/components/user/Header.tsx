import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initials = user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.trim() : "";
  const isLandingPage = location.pathname === "/";

  return (
    <header className="border-border bg-sidebar sticky top-0 z-50 flex justify-between border-b px-8 py-4">
      <div className="header-left">
        <Link to="/" className="flex items-center gap-3">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <polyline
                  points="2,15 6,15 9,8 13,20 17,6 20,15 24,15"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Vaidix</span>
              <span className="logo-subtitle">Medical MCQ Platform</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
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

        {/* CTA Button */}
        {isLandingPage && (
          <Link to="/auth/login">
            <button className="cta-button">
              Start Free →
            </button>
          </Link>
        )}
      </div>
    </header>

    
  );
};

export default Header;
