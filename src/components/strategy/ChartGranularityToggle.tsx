import { MonitoringGranularity } from '@/types/project';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Clock } from 'lucide-react';

interface ChartGranularityToggleProps {
  value: MonitoringGranularity;
  onChange: (v: MonitoringGranularity) => void;
}

export function ChartGranularityToggle({ value, onChange }: ChartGranularityToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Clock className="h-3 w-3 text-muted-foreground" />
      <ToggleGroup
        type="single"
        size="sm"
        value={value}
        onValueChange={(v) => v && onChange(v as MonitoringGranularity)}
        className="bg-muted/50 rounded-md p-0.5"
      >
        <ToggleGroupItem
          value="hour"
          className="h-6 px-2 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          按小时
        </ToggleGroupItem>
        <ToggleGroupItem
          value="minute"
          className="h-6 px-2 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
        >
          按分钟
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
