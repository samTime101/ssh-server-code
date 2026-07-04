import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createSubscription,
  deleteSubscription,
  updateSubscription,
} from "@/services/admin/subscription-service";
import { fetchSubscriptions } from "@/services/subscription-service";
import type { Subscription, SubscriptionFormState } from "@/types/subscription";

const emptyForm = (): SubscriptionFormState => ({
  plan_name: "",
  description: "",
  price: "",
  number_of_months: "",
  status: false,
});

export const useManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [form, setForm] = useState<SubscriptionFormState>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setIsLoading(true);
    try {
      setSubscriptions(await fetchSubscriptions());
    } catch {
      toast.error("Failed to load subscriptions");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm());
    setImageFile(null);
    setEditingSubscription(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setForm({
      plan_name: subscription.plan_name,
      description: subscription.description,
      price: subscription.price,
      number_of_months: String(subscription.number_of_months),
      status: subscription.status,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const updateField = <K extends keyof SubscriptionFormState>(
    field: K,
    value: SubscriptionFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => {
    const plan_name = form.plan_name.trim();
    const description = form.description.trim();
    const price = form.price.trim();
    const number_of_months = Number(form.number_of_months);

    if (!plan_name) {
      toast.error("Plan name is required");
      return null;
    }
    if (!description) {
      toast.error("Description is required");
      return null;
    }
    if (!price || Number.isNaN(Number(price))) {
      toast.error("Valid price is required");
      return null;
    }
    if (!Number.isInteger(number_of_months) || number_of_months <= 0) {
      toast.error("Number of months must be a positive integer");
      return null;
    }

    return {
      plan_name,
      description,
      price,
      number_of_months,
      status: form.status,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      if (editingSubscription) {
        await updateSubscription(editingSubscription.id, payload, imageFile);
        toast.success("Subscription updated successfully");
      } else {
        await createSubscription(payload, imageFile);
        toast.success("Subscription created successfully");
      }
      closeForm();
      await loadSubscriptions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subscription: Subscription) => {
    if (!window.confirm(`Delete "${subscription.plan_name}"?`)) return;

    try {
      await deleteSubscription(subscription.id);
      toast.success("Subscription deleted successfully");
      await loadSubscriptions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subscription");
    }
  };

  return {
    subscriptions,
    isLoading,
    isFormOpen,
    editingSubscription,
    form,
    imageFile,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
    setImageFile,
    handleSubmit,
    handleDelete,
  };
};
