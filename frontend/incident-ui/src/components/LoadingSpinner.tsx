import { Skeleton } from './ui/skeleton';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-full bg-[#2e3149]" />
        <Skeleton className="h-12 w-full bg-[#2e3149]" />
        <Skeleton className="h-12 w-full bg-[#2e3149]" />
      </div>
    </div>
  );
}

export function TableLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-[#2e3149]" />
      ))}
    </div>
  );
}
