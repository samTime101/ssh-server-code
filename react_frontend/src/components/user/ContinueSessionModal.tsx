import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ContinueSessionChoice = "continue" | "new" | "cancel";

interface ContinueSessionModalProps {
  open: boolean;
  message: string;
  onChoose: (choice: ContinueSessionChoice) => void;
}

export const ContinueSessionModal = ({ open, message, onChoose }: ContinueSessionModalProps) => {
  if (!open) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm duration-150"
      onClick={() => onChoose("cancel")}
    >
      <div
        className="bg-background animate-in slide-in-from-bottom-4 flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl p-8 shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <RefreshCw size={24} className="text-amber-600" />
        </div>
        <h2 className="text-foreground text-xl font-bold">Continue Session?</h2>
        <p className="text-muted-foreground my-1 mb-4 text-center text-sm leading-relaxed">
          {message}
        </p>
        <div className="flex w-full flex-col gap-2">
          <Button className="w-full" onClick={() => onChoose("continue")}>
            Continue last session
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onChoose("new")}>
            Start new session
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onChoose("cancel")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export const useContinueSessionPrompt = (message: string) => {
  const [open, setOpen] = useState(false);
  const resolveRef = useRef<((choice: ContinueSessionChoice) => void) | null>(null);

  const ask = () =>
    new Promise<ContinueSessionChoice>((resolve) => {
      resolveRef.current = resolve;
      setOpen(true);
    });

  const onChoose = (choice: ContinueSessionChoice) => {
    setOpen(false);
    resolveRef.current?.(choice);
    resolveRef.current = null;
  };

  return {
    ask,
    modal: <ContinueSessionModal open={open} message={message} onChoose={onChoose} />,
  };
};
