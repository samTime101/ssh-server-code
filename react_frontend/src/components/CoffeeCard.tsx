import React, { useState } from "react";
import { Coffee } from "lucide-react";
import Modal from "@/components/Modal";
import SubscriptionCard from "@/components/SubscriptionCard";

const CoffeeCard: React.FC = () => {
  const [isQrOpen, setIsQrOpen] = useState(false);

  return (
    <>
      <SubscriptionCard
        icon={
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded">
            <Coffee className="text-primary h-6 w-6" />
          </div>
        }
        title="Buy us a coffee"
        description="Enjoying Vaidix? A small tip helps us keep the platform running."
        onSelect={() => setIsQrOpen(true)}
      />

      <Modal
        open={isQrOpen}
        onOpenChange={setIsQrOpen}
        title="Buy us a coffee"
        contentClassName="sm:max-w-md overflow-y-auto"
      >
        <p className="text-muted-foreground mb-6 text-sm">
          Scan the QR code below to send a tip. Thank you for your support!
        </p>
        <div className="border-border bg-muted/30 mx-auto flex aspect-square w-56 items-center justify-center rounded-lg border border-dashed">
          <span className="text-muted-foreground text-sm">QR placeholder</span>
        </div>
      </Modal>
    </>
  );
};

export default CoffeeCard;
