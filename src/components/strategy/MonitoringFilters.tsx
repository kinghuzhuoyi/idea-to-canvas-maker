import { MonitoringFilter } from '@/types/project';
import { businessCodeOptions, customerTagOptions } from '@/data/mockMonitoringData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Calendar as CalendarIcon } from 'lucide-react';

interface MonitoringFiltersProps {
  filter: MonitoringFilter;
  onFilterChange: (filter: MonitoringFilter) => void;
}

function getTodayLabel() {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
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

      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
        <CalendarIcon className="h-3.5 w-3.5" />
        <span>当日数据</span>
        <span className="font-mono text-foreground">{getTodayLabel()}</span>
      </div>
    </div>
  );
}
