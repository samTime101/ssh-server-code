import { CreditCard, FileQuestion, Users } from "lucide-react";
import { AdminDashboardStatCard } from "@/components/admin/AdminDashboardStatCard";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboardPage = () => {
  const { stats, isLoading } = useAdminDashboard();

  return (
    <div>
      <div>
        <h1 className="text-foreground text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || !stats ? (
          <>
            <Skeleton className="h-[148px] rounded-xl" />
            <Skeleton className="h-[148px] rounded-xl" />
            <Skeleton className="h-[148px] rounded-xl" />
          </>
        ) : (
          <>
            <AdminDashboardStatCard
              title="Questions"
              value={stats.total_questions}
              icon={FileQuestion}
              subtitle="Total questions in the bank"
              actionLabel="Add question"
              to="/admin/add-question"
              variant="questions"
            />
            <AdminDashboardStatCard
              title="Users"
              value={stats.active_users}
              icon={Users}
              subtitle="Total active users"
              actionLabel="Manage users"
              to="/admin/manage-users"
              variant="users"
            />
            <AdminDashboardStatCard
              title="Subscription"
              value={stats.current_subscription}
              icon={CreditCard}
              subtitle="Your current plan"
              actionLabel="Manage subscriptions"
              to="/admin/manage-subscriptions"
              variant="subscription"
              valueClassName="text-2xl"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
