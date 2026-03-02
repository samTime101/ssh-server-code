const Loader = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-border border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
