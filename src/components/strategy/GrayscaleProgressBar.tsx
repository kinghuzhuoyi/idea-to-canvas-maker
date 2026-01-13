import { cn } from '@/lib/utils';

interface GrayscaleProgressBarProps {
  ratio: number;
  isPaused?: boolean;
  className?: string;
}

export function GrayscaleProgressBar({ ratio, isPaused, className }: GrayscaleProgressBarProps) {
  // 预设的流量阈值标记
  const markers = [10, 25, 50, 75, 100];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">灰度流量分配</span>
        <span className={cn(
          "font-bold text-lg",
          isPaused ? "text-muted-foreground" : "text-emerald-500"
        )}>
          {ratio}%
        </span>
      </div>
      
      <div className="relative">
        {/* Background track */}
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          {/* Grayscale portion */}
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
              isPaused 
                ? "bg-muted-foreground/50" 
                : "bg-gradient-to-r from-emerald-400 to-emerald-500"
            )}
            style={{ width: `${ratio}%` }}
          >
            {!isPaused && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
        </div>

        {/* Markers */}
        <div className="absolute inset-x-0 top-0 h-3 flex">
          {markers.map(marker => (
            <div
              key={marker}
              className="absolute h-full flex flex-col items-center"
              style={{ left: `${marker}%`, transform: 'translateX(-50%)' }}
            >
              <div className={cn(
                "w-0.5 h-full",
                marker <= ratio ? "bg-white/30" : "bg-muted-foreground/20"
              )} />
            </div>
          ))}
        </div>

        {/* Marker labels */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground px-0.5">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Traffic distribution info */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-3 h-3 rounded-sm",
            isPaused ? "bg-muted-foreground/50" : "bg-emerald-500"
          )} />
          <span className="text-muted-foreground">灰度版本 {ratio}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/30" />
          <span className="text-muted-foreground">生效版本 {100 - ratio}%</span>
        </div>
      </div>
    </div>
  );
}
