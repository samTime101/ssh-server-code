import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ScoreSummaryModalProps } from "@/types/modal";




const CIRCUMFERENCE = 2 * Math.PI * 58; 

const ScoreSummaryModal = ({
  isOpen,
  scoreData,
  onReturnToHome,
  // onReviewAnswers,
}: ScoreSummaryModalProps) => {
  const arcRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);

  const percentage =
    scoreData.totalQuestions > 0
      ? Math.round((scoreData.correctAnswers / scoreData.totalQuestions) * 100)
      : 0;

  const finalScore = scoreData.totalPoints;

  useEffect(() => {
    if (!isOpen) return;

    const arc = arcRef.current;
    const lbl = scoreRef.current;
    if (!arc || !lbl) return;

    arc.style.strokeDashoffset = String(CIRCUMFERENCE);
    lbl.textContent = "0.00";

    const duration = 900;
    const start = performance.now();

    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = ease(t);
      const offset = CIRCUMFERENCE - CIRCUMFERENCE * eased * (percentage / 100);
      arc.style.strokeDashoffset = String(offset.toFixed(2));
      lbl.textContent = (finalScore * eased).toFixed(2);
      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isOpen, percentage, finalScore]);

  const penaltyPoints = (scoreData.incorrectAnswers * 0.25).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onReturnToHome()}>
      <DialogContent className="max-w-lg gap-0 p-8">
        <DialogHeader className="mb-6 items-center text-center">
          {/* Score Ring */}
          <div className="relative mb-4 inline-block h-36 w-36">
            <svg
              viewBox="0 0 140 140"
              width="140"
              height="140"
              className="-rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-border"
              />
              <circle
                ref={arcRef}
                cx="70"
                cy="70"
                r="58"
                fill="none"
                stroke="#6366F1"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                ref={scoreRef}
                className="font-mono text-3xl font-medium leading-none tabular-nums text-indigo-500"
              >
                {finalScore}
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                pts
              </span>
            </div>
          </div>

          <h2 className="text-xl font-medium tracking-tight">
            Practice test completed
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's a breakdown of your performance.
          </p>
        </DialogHeader>

        <div className="space-y-3">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-2.5">
            <StatCard label="Total" value={scoreData.totalQuestions} />
            <StatCard label="Attempted" value={scoreData.attemptedQuestions} />

            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-green-700 dark:text-green-400">
                Correct
              </p>
              <p className="font-mono text-[22px] font-medium leading-none text-green-700 dark:text-green-400">
                {scoreData.correctAnswers}
              </p>
              <p className="mt-1 text-[11px] text-green-600/80 dark:text-green-500">
                of {scoreData.attemptedQuestions} chosen
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-red-700 dark:text-red-400">
                Wrong
              </p>
              <p className="font-mono text-[22px] font-medium leading-none text-red-700 dark:text-red-400">
                {scoreData.incorrectAnswers}
              </p>
              <p className="mt-1 text-[11px] text-red-600/80 dark:text-red-500">
                - {penaltyPoints} pts
              </p>
            </div>
          </div>


          {/* Actions */}
          <div className="flex gap-2.5 pt-1">
            <Button
              onClick={onReturnToHome}
              className="h-10 flex-1 bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Return to practice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg bg-muted/60 p-3">
    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
      {label}
    </p>
    <p className="font-mono text-[22px] font-medium leading-none">{value}</p>
  </div>
);

export default ScoreSummaryModal;