import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="navbar ">
      {/* Logo Section */}
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
      {/* Navigation Links */}
      {/* {isLandingPage && (
        <div className="nav-links">
          {["Features", "Subjects", "Pricing", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
            </a>
          ))}
        </div>
      )} */}

      {/* CTA Button */}
      {isLandingPage && (
        <Link to="/auth/login">
          <button className="cta-button">
            Start Free →
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;