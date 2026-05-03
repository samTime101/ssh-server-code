import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-root">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="bg-grid-main" />
        <div className="bg-grid-secondary" />
        <div className="bg-glow" />
        <div className="bg-fade-bottom" />
      </div>
      <Navbar />
      {/* HERO */}
      <section className="mx-auto px-6 pt-12 pb-20 relative z-10 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT */}
          <div className="flex flex-col justify-center pt-4">
            <h1 className="hero-title">
              Practice That <br />
              Builds <span className="hero-highlight">Confidence.</span> <br />
              <span className="hero-bold">Questions</span> <br />
              <span className="hero-bold">That Build</span> <br />
              <span className="hero-highlight">Precision.</span>
            </h1>

            <p className="mt-8 text-lg leading-relaxed text-slate-400 max-w-[420px]">
              Vaidix is built for medical students who take their craft seriously.
              Deep question banks, clinical reasoning, and adaptive feedback —
              designed to turn exam pressure into clinical confidence.
            </p>

            <div className="flex items-center gap-5 mt-10">
              <Link to="/auth/login">
                <button className="primary-btn">
                  Start for <br /> free
                </button>
              </Link>

              {/* <a
                href="#demo"
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition"
              >
                <span>Watch</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polygon
                    points="6,3 15,9 6,15"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
                <span>demo</span>
              </a> */}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="flex justify-center lg:justify-end">
            <div className="qbank-card w-full">

              {/* Tags */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-semibold uppercase px-3 py-1.5 rounded-full border border-green-400/40 bg-green-400/10 text-green-400">
                  Pharmacology
                </span>

                <span className="text-[11px] font-semibold uppercase px-3 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                  Medium
                </span>

                <span className="text-sm ml-auto text-slate-500">
                  Q 07 / 26
                </span>
              </div>

              {/* Progress */}
              <div className="flex rounded-full overflow-hidden mb-7 h-1 bg-slate-800">
                <div className="w-[45%] bg-blue-500" />
                <div className="w-[15%] bg-green-500" />
                <div className="w-[10%] bg-red-500" />
              </div>

              {/* Question */}
              <p className="text-[17px] leading-relaxed mb-7 text-slate-200">
                A patient presents with{" "}
                <em className="hero-highlight font-semibold">
                  dry mouth
                </em>
                ,{" "}
                <em className="hero-highlight font-semibold">
                  blurred vision
                </em>
                , and{" "}
                <em className="hero-highlight font-semibold">
                  urinary retention
                </em>{" "}
                after taking medication for motion sickness. Which receptor does
                this drug primarily antagonise?
              </p>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    letter: "A",
                    text: "Nicotinic receptor (N)",
                  },
                  {
                    letter: "B",
                    text: "Muscarinic receptor (M1–M5)",
                  },
                  {
                    letter: "C",
                    text: "Dopaminergic receptor (D2)",
                  },
                  {
                    letter: "D",
                    text: "α-adrenergic receptor (α1)",
                  },
                ].map((option) => (
                  <div key={option.letter} className="option-item">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold bg-slate-700/40 text-slate-400 border border-slate-600">
                      {option.letter}
                    </span>
                    <span className="text-[15px] text-slate-300">
                      {option.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-root relative z-10 mt-8">
        <div className="mx-auto px-6 py-14 max-w-[1200px]">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
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
                <span className="text-base font-bold ">
                  Vaidix
                </span>
              </div>

              <p className="text-sm ">
                Building clinical confidence through smarter practice.
              </p>
            </div>

            {/* Columns */}
            {/* {["Product", "Resources", "Company"].map((section) => (
              <div key={section}>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-slate-400">
                  {section}
                </h4>

                <ul className="flex flex-col gap-2.5">
                  {["Item 1", "Item 2", "Item 3", "Item 4"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm  hover:text-slate-200 transition"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))} */}

          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 gap-4 border-t border-slate-700/30">
            <p className="text-xs ">
              © 2026 Vaidix. All rights reserved.
            </p>

            <div className="flex gap-5 ">
              <a href="#" className="hover:text-white">Powered by:</a>
              <a href="https://sisanitech.com.np" >SisaniTech</a>
        
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;