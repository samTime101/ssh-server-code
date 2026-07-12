import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import RecaptchaField from "@/components/RecaptchaField";
import { useRecaptchaGate } from "@/hooks/useRecaptchaGate";
import { submitFeedbackForm } from "@/services/user/feedback-service";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const LandingPage = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [feedbackError, setFeedbackError] = useState("");
  const feedbackRecaptcha = useRecaptchaGate();

  const openFeedbackModal = () => {
    setIsFeedbackOpen(true);
    setFeedbackStatus("idle");
    setFeedbackError("");
  };

  const closeFeedbackModal = () => {
    setIsFeedbackOpen(false);
    feedbackRecaptcha.hideRecaptcha();
  };

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackRecaptcha.requireRecaptcha()) {
      return;
    }
    try {
      setFeedbackStatus("submitting");
      setFeedbackError("");
      const result = await submitFeedbackForm({
        email: feedbackEmail,
        feedback: feedbackText,
        recaptcha: feedbackRecaptcha.recaptchaToken ?? undefined,
      });
      if (!result.ok) {
        setFeedbackStatus("error");
        setFeedbackError(result.error);
        if (result.recaptchaError) {
          feedbackRecaptcha.handleRecaptchaApiError();
        }
        return;
      }
      setFeedbackStatus("success");
      setFeedbackText("");
      feedbackRecaptcha.resetRecaptcha();
    } catch {
      setFeedbackStatus("error");
      setFeedbackError("We could not submit your feedback. Please try again.");
    }
  };

  return (
    <div className="landing-root">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="bg-grid-main" />
        <div className="bg-grid-secondary" />
        <div className="bg-glow" />
        <div className="bg-fade-bottom" />
      </div>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pt-12 pb-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col justify-center pt-4">
            <h1 className="hero-title">
              Practice That <br />
              Builds <span className="hero-highlight">Confidence.</span> <br />
              <span className="hero-title">Questions</span> <br />
              <span className="hero-title">That Build</span> <br />
              <span className="hero-highlight">Precision.</span>
            </h1>

            <p className="hero-text mt-8 max-w-[420px] text-lg leading-relaxed text-slate-400">
              Vaidix is built for medical students who take their craft seriously. Deep question
              banks, clinical reasoning, and adaptive feedback — designed to turn exam pressure into
              clinical confidence.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <Link to="/auth/login">
                <button className="primary-btn">
                  Start for <br /> free
                </button>
              </Link>

              <button type="button" className="feedback-btn" onClick={openFeedbackModal}>
                Give us <br /> feedback
              </button>

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
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1.5 text-[11px] font-semibold text-green-400 uppercase">
                  Pharmacology
                </span>

                {/* <span className="text-[11px] font-semibold uppercase px-3 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                  Medium
                </span> */}

                <span className="ml-auto text-sm text-slate-500">Q 07 / 26</span>
              </div>

              {/* Progress */}
              <div className="mb-7 flex h-1 overflow-hidden rounded-full bg-slate-800">
                <div className="w-[45%] bg-blue-500" />
                <div className="w-[15%] bg-green-500" />
                <div className="w-[10%] bg-red-500" />
              </div>

              {/* Question */}
              <p className="hero-text mb-7 text-[17px] leading-relaxed text-slate-200">
                A patient presents with {/* <em className="hero-highlight "> */}
                dry mouth
                {/* </em> */}, {/* <em className="hero-highlight "> */}
                blurred vision
                {/* </em> */}, and {/* <em className="hero-highlight "> */}
                urinary retention
                {/* </em>{" "} */}
                after taking medication for motion sickness. Which receptor does this drug primarily
                antagonise?
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
                    <span className="hero-text flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-700/40 text-xs font-semibold">
                      {option.letter}
                    </span>
                    <span className="hero-text text-[15px]">{option.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {isFeedbackOpen && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <div className="feedback-modal-header">
              <div>
                <p className="feedback-modal-eyebrow">Feedback</p>
                <h3 className="feedback-modal-title">Tell us what to improve</h3>
              </div>
              <button type="button" onClick={closeFeedbackModal} className="feedback-modal-close">
                Close
              </button>
            </div>

            <form className="feedback-modal-body" onSubmit={handleFeedbackSubmit}>
              <div className="feedback-field">
                <label className="feedback-label">Email</label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(event) => setFeedbackEmail(event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  className="feedback-input"
                  required
                />
              </div>

              <div className="feedback-field">
                <label className="feedback-label">Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  placeholder="Share your feedback, ideas, or anything we should fix."
                  maxLength={2000}
                  rows={5}
                  className="feedback-textarea"
                  required
                />
              </div>

              {feedbackStatus === "error" && (
                <p className="feedback-message feedback-message-error">{feedbackError}</p>
              )}
              {feedbackStatus === "success" && (
                <p className="feedback-message feedback-message-success">
                  Thanks for the feedback. We appreciate it.
                </p>
              )}

              {feedbackRecaptcha.showRecaptcha && (
                <RecaptchaField
                  ref={feedbackRecaptcha.recaptchaRef}
                  onChange={feedbackRecaptcha.handleRecaptchaChange}
                  error={feedbackRecaptcha.recaptchaError}
                />
              )}

              <div className="feedback-modal-footer">
                <p className="feedback-note">We will never share your email.</p>
                <button
                  type="submit"
                  disabled={feedbackStatus === "submitting"}
                  className="feedback-submit"
                >
                  {feedbackStatus === "submitting" ? "Sending..." : "Send feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer-root relative z-10 mt-8">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
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
                <span className="text-base font-bold">Vaidix</span>
              </div>

              <p className="text-sm">Building clinical confidence through smarter practice.</p>
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
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/30 pt-6 sm:flex-row">
            <p className="text-xs">© 2026 Vaidix. All rights reserved.</p>

            <div className="flex gap-5">
              <a href="#" className="hover:text-white">
                Powered by:
              </a>
              <a href="https://sisanitech.com.np">SisaniTech</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
