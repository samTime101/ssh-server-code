import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import Paginator from "@/components/Paginator";
import { useManageFeedbacks } from "@/hooks/admin/useManageFeedbacks";

const ApplicationFeedbackPage = () => {
  const {
    feedbacks,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
  } = useManageFeedbacks();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Application Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Review feedback submitted from the public landing page.
          </p>
        </div>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <TableSkeletonLoader rows={4} columns={1} />
          ) : feedbacks.length === 0 ? (
            <div className="text-muted-foreground text-sm">No feedback submitted yet.</div>
          ) : (
            feedbacks.map((entry) => (
              <div
                key={entry.id}
                className="border-border bg-background/60 flex flex-col gap-3 rounded-md border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-foreground text-sm font-semibold">{entry.email}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                    Application feedback
                  </span>
                </div>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {entry.feedback}
                </p>
              </div>
            ))
          )}
        </div>

        <Paginator
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          pageSize={pageSize}
          totalCount={pagination.count}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ApplicationFeedbackPage;
