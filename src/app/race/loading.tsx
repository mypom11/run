import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-6">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-14 w-full" />
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[5/6]" />
        ))}
      </div>
    </div>
  );
}
