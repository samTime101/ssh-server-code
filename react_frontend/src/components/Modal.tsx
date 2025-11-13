import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ModalProps } from "@/types/modal";

const Modal = ({ open, onOpenChange, title, children }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />}
    <DialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] sm:max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-white p-8">
      <DialogHeader>
        {title && <DialogTitle className="mb-4 text-xl font-semibold">{title}</DialogTitle>}
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

export default Modal;