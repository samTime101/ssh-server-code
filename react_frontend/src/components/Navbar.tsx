import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4 mx-auto relative z-10"
      style={{ maxWidth: 1200 }}
    >
    
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-xl"
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
              fill="none"
            />
          </svg>
        </div>
        <div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}
          >
            Vaidix
          </span>
          <span
            className="block text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: "#64748b", marginTop: -2 }}
          >
            Medical MCQ Platform
          </span>
        </div>
      </div>

    
      <div className="hidden md:flex items-center gap-8">
        {["Features", "Subjects", "Pricing", "About"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <Link to="/auth/login">
        <button
          className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #3b5bfd 0%, #4f6bff 100%)",
            color: "#fff",
            border: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #4f6bff 0%, #6b82ff 100%)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #3b5bfd 0%, #4f6bff 100%)")
          }
        >
          Start Free →
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
