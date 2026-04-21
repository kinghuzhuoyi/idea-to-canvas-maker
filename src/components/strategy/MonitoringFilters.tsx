import { MonitoringFilter } from '@/types/project';
import { businessCodeOptions, customerTagOptions } from '@/data/mockMonitoringData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Filter, Calendar as CalendarIcon } from 'lucide-react';

interface MonitoringFiltersProps {
  filter: MonitoringFilter;
  onFilterChange: (filter: MonitoringFilter) => void;
}

export function MonitoringFilters({ filter, onFilterChange }: MonitoringFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4 text-primary" />
        筛选条件
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">业务场景</span>
        <Select
          value={filter.businessCode}
          onValueChange={(v) => onFilterChange({ ...filter, businessCode: v })}
        >
          <SelectTrigger className="h-8 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {businessCodeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">客户标签</span>
        <Select
          value={filter.customerTag}
          onValueChange={(v) => onFilterChange({ ...filter, customerTag: v })}
        >
          <SelectTrigger className="h-8 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {customerTagOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <ToggleGroup
          type="single"
          size="sm"
          value={filter.dateRange}
          onValueChange={(v) => v && onFilterChange({ ...filter, dateRange: v as MonitoringFilter['dateRange'] })}
          className="bg-muted/50 rounded-md p-0.5"
        >
          <ToggleGroupItem value="today" className="h-7 px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm">
            今日
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" className="h-7 px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm">
            近7日
          </ToggleGroupItem>
          <ToggleGroupItem value="30d" className="h-7 px-3 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm">
            近30日
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
