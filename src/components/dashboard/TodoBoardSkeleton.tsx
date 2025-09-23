import { Skeleton } from "@/components/ui/skeleton";

export default function TodoBoardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-7 w-40" />
          <div className="flex flex-col gap-4 rounded-lg p-2 min-h-[200px]">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-7 w-40" />
          <div className="flex flex-col gap-4 rounded-lg p-2 min-h-[200px]">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-7 w-40" />
          <div className="flex flex-col gap-4 rounded-lg p-2 min-h-[200px]">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
