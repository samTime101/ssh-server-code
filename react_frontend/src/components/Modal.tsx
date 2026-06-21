import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ModalProps } from "@/types/modal";

const Modal = ({ open, onOpenChange, title, children, contentClassName }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className={`bg-card max-h-[90vh] rounded-md p-8 sm:max-w-5xl ${contentClassName ?? "overflow-y-auto"}`.trim()}
    >
      <DialogHeader>
        {title && <DialogTitle className="mb-4 text-xl font-semibold">{title}</DialogTitle>}
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

export default Modal;
