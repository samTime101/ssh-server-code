import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <div
      className="absolute top-0 right-0 left-0 z-10 mx-auto flex px-6 py-4"
      style={{ maxWidth: 1200 }}
    >
      <Link to="/" className="flex items-center gap-3">
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
            className="text-foreground text-xl font-bold tracking-tight"
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
  );
};

export default AuthNavbar;
