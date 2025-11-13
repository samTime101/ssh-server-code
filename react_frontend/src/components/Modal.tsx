import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ModalProps } from "@/types/modal";

const Modal = ({
  open,
  onOpenChange,
  title,
  children,
}: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-animate-overlayShow" />
      <Dialog.Content
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-8 w-1/2 max-h-[90vh] overflow-y-auto`}
      >
        {title && (
          <Dialog.Title className="text-xl font-semibold mb-4">
            {title}
          </Dialog.Title>
        )}
        {/* Render children passed from other components to this Modal */}
        {children}
        <Dialog.Close asChild>
          <Button
            variant="secondary"
            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full w-7 h-7"
          >
            <X size={16} />
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;