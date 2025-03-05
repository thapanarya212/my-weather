import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Forecast Header Skeleton */}
      <Skeleton className="h-10 w-1/3 rounded-lg" />

      {/* Main Forecast Section */}
      <div className="grid gap-6">
        {/* Current Weather Skeleton */}
        <Skeleton className="h-[250px] w-full rounded-lg" />

        {/* 5-Day Forecast Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
              {/* Date & Description */}
              <div className="flex flex-col">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg mt-1" />
              </div>

              {/* Weather Icon Placeholder */}
              <Skeleton className="h-10 w-10 rounded-full" />

              {/* Temperature Min/Max */}
              <div className="flex flex-col">
                <Skeleton className="h-4 w-16 rounded-lg" />
                <Skeleton className="h-4 w-16 rounded-lg mt-1" />
              </div>

              {/* Humidity & Wind */}
              <div className="flex flex-col items-end">
                <Skeleton className="h-4 w-16 rounded-lg" />
                <Skeleton className="h-4 w-16 rounded-lg mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
