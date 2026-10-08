export default function TaskDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-6">
      <div className="h-4 w-36 rounded-md bg-muted" />
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="h-6 w-1/3 rounded-md bg-muted" />
        <div className="h-4 w-full rounded-md bg-muted" />
        <div className="h-4 w-5/6 rounded-md bg-muted" />
        <div className="h-4 w-2/3 rounded-md bg-muted" />
      </div>
    </div>
  );
}