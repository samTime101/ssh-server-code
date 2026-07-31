import { useRef, useState } from "react";
import { ConfirmModal } from "@/components/ConfirmModal";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: "" });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = (input: string | ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOptions(typeof input === "string" ? { message: input } : input);
      setOpen(true);
    });

  const handleConfirm = () => {
    setOpen(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setOpen(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  const modal = (
    <ConfirmModal
      open={open}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, modal };
};
