import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c1428 0%, #0f1a30 40%, #111d35 100%)",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e2e8f0",
      }}
    >
      
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.3; }
        }
        @keyframes glowMove {
          0%, 100% { opacity: 0.04; transform: translate(-20%, -10%); }
          50% { opacity: 0.08; transform: translate(10%, 5%); }
        }
      `}</style>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 0 }}
      >
        
        <div
          className="absolute"
          style={{
            inset: "-60px",
            backgroundImage: `
              linear-gradient(rgba(59, 91, 253, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 91, 253, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridMove 8s linear infinite",
          }}
        />
        
        <div
          className="absolute"
          style={{
            inset: "-60px",
            backgroundImage: `
              linear-gradient(rgba(45, 212, 191, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 212, 191, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridPulse 6s ease-in-out infinite",
          }}
        />
        
        <div
          className="absolute"
          style={{
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
            background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(59, 91, 253, 0.07) 0%, transparent 70%)",
            animation: "glowMove 12s ease-in-out infinite",
          }}
        />
        
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "40%",
            background: "linear-gradient(to top, #0c1428 0%, transparent 100%)",
          }}
        />
      </div>

      <Navbar />

      
      <section
        className="mx-auto px-6 pt-12 pb-20 relative z-10"
        style={{ maxWidth: 1200 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="flex flex-col justify-center pt-4">
            <h1
              className="leading-[1.08] tracking-tight"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                color: "#f1f5f9",
                fontWeight: 400,
              }}
            >
              Practice That
              <br />
              Builds{" "}
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  color: "#2dd4bf",
                }}
              >
                Confidence.
              </span>
              <br />
              <span style={{ fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>
                Questions
              </span>
              <br />
              <span style={{ fontWeight: 700, fontFamily: "'DM Serif Display', serif" }}>
                That Build
              </span>
              <br />
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: "italic",
                  color: "#2dd4bf",
                }}
              >
                Precision.
              </span>
            </h1>

            <p
              className="mt-8 text-lg leading-relaxed"
              style={{
                color: "#94a3b8",
                maxWidth: 420,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Vaidix is built for medical students who take their craft seriously.
              Deep question banks, clinical reasoning, and adaptive feedback —
              designed to turn exam pressure into clinical confidence.
            </p>

            
            <div className="flex items-center gap-5 mt-10">
              <Link to="/auth/login">
                <button
                  className="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #3b5bfd 0%, #4f6bff 100%)",
                    color: "#fff",
                    border: "none",
                    fontSize: 16,
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
                  Start for
                  <br />
                  free
                </button>
              </Link>
              <a
                href="#demo"
                className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                style={{ color: "#94a3b8" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e2e8f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <span>Watch</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polygon
                    points="6,3 15,9 6,15"
                    fill="#94a3b8"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>demo</span>
              </a>
            </div>
          </div>

          
          <div className="flex justify-center lg:justify-end">
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                maxWidth: 480,
                background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
                border: "1px solid rgba(59, 91, 253, 0.15)",
                boxShadow:
                  "0 0 60px rgba(59, 91, 253, 0.08), 0 0 120px rgba(59, 91, 253, 0.04)",
                padding: "28px 28px 20px",
              }}
            >
            
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                  style={{
                    color: "#22c55e",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    background: "rgba(34, 197, 94, 0.08)",
                  }}
                >
                  Pharmacology
                </span>
                <span
                  className="text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                  style={{
                    color: "#eab308",
                    border: "1px solid rgba(234, 179, 8, 0.4)",
                    background: "rgba(234, 179, 8, 0.08)",
                  }}
                >
                  Medium
                </span>
                <span
                  className="text-sm ml-auto"
                  style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Q 07 / 26
                </span>
              </div>

              
              <div
                className="flex rounded-full overflow-hidden mb-7"
                style={{ height: 4, background: "#1e293b" }}
              >
                <div style={{ width: "45%", background: "#3b5bfd" }} />
                <div style={{ width: "15%", background: "#22c55e" }} />
                <div style={{ width: "10%", background: "#ef4444" }} />
              </div>

              
              <p
                className="text-[17px] leading-relaxed mb-7"
                style={{ color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}
              >
                A patient presents with{" "}
                <em style={{ color: "#2dd4bf", fontStyle: "italic", fontWeight: 600 }}>
                  dry mouth
                </em>
                ,{" "}
                <em style={{ color: "#2dd4bf", fontStyle: "italic", fontWeight: 600 }}>
                  blurred vision
                </em>
                , and{" "}
                <em style={{ color: "#2dd4bf", fontStyle: "italic", fontWeight: 600 }}>
                  urinary retention
                </em>{" "}
                after taking medication for motion sickness. Which receptor does
                this drug primarily antagonise?
              </p>

              
              <div className="flex flex-col gap-3">
                {[
                  {
                    letter: "A",
                    text: (
                      <>
                        Nicotinic receptor M<sub>)</sub> (N
                      </>
                    ),
                    textAlt: "Nicotinic receptor (N)",
                  },
                  {
                    letter: "B",
                    text: (
                      <>
                        Muscarinic receptor (M<sub>1</sub>–M<sub>5</sub>)
                      </>
                    ),
                  },
                  {
                    letter: "C",
                    text: (
                      <>
                        Dopaminergic receptor (D<sub>2</sub>)
                      </>
                    ),
                  },
                  {
                    letter: "D",
                    text: (
                      <>
                        α-adrenergic receptor (α<sub>1</sub>)
                      </>
                    ),
                  },
                ].map((option) => (
                  <div
                    key={option.letter}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(148, 163, 184, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border =
                        "1px solid rgba(59, 91, 253, 0.4)";
                      e.currentTarget.style.background = "rgba(59, 91, 253, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border =
                        "1px solid rgba(148, 163, 184, 0.1)";
                      e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                    }}
                  >
                    <span
                      className="flex items-center justify-center rounded-full text-xs font-semibold shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        background: "rgba(148, 163, 184, 0.12)",
                        color: "#94a3b8",
                        border: "1px solid rgba(148, 163, 184, 0.15)",
                      }}
                    >
                      {option.letter}
                    </span>
                    <span
                      className="text-[15px]"
                      style={{
                        color: "#cbd5e1",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <footer
        className="relative z-10 mt-8"
        style={{
          borderTop: "1px solid rgba(148, 163, 184, 0.1)",
          background: "rgba(8, 14, 30, 0.6)",
          backdropFilter: "blur(12px)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          className="mx-auto px-6 py-14"
          style={{ maxWidth: 1200 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: 34,
                    height: 34,
                    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
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
                <span
                  className="text-base font-bold"
                  style={{ color: "#f1f5f9" }}
                >
                  Vaidix
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#64748b", maxWidth: 220 }}
              >
                Building clinical confidence through smarter practice.
              </p>
            </div>

            
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: "#94a3b8" }}
              >
                Product
              </h4>
              <ul className="flex flex-col gap-2.5">
                {["Features", "Question Banks", "Subjects", "Pricing"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#e2e8f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#64748b")
                        }
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: "#94a3b8" }}
              >
                Resources
              </h4>
              <ul className="flex flex-col gap-2.5">
                {["Blog", "Study Guides", "Help Center", "Community"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#e2e8f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#64748b")
                        }
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            
            <div>
              <h4
                className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
                style={{ color: "#94a3b8" }}
              >
                Company
              </h4>
              <ul className="flex flex-col gap-2.5">
                {["About", "Careers", "Privacy Policy", "Terms of Service"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "#64748b" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#e2e8f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#64748b")
                        }
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          
          <div
            className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 gap-4"
            style={{ borderTop: "1px solid rgba(148, 163, 184, 0.08)" }}
          >
            <p className="text-xs" style={{ color: "#475569" }}>
              © 2026 Vaidix. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              
              <a href="#" style={{ color: "#475569" }} className="transition-colors duration-200 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            
              <a href="#" style={{ color: "#475569" }} className="transition-colors duration-200 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              
              <a href="#" style={{ color: "#475569" }} className="transition-colors duration-200 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
