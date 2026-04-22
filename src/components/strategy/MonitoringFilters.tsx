import { MonitoringFilter } from '@/types/project';
import { businessCodeOptions, customerTagOptions } from '@/data/mockMonitoringData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Filter, Calendar as CalendarIcon, GitBranch } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface VersionOption {
  value: string;
  label: string;
}

interface MonitoringFiltersProps {
  filter: MonitoringFilter;
  onFilterChange: (filter: MonitoringFilter) => void;
  versionOptions?: VersionOption[];
  selectedVersion?: string;
  onVersionChange?: (v: string) => void;
  selectedDate?: Date;
  onDateChange?: (d: Date) => void;
}

export function MonitoringFilters({
  filter,
  onFilterChange,
  versionOptions = [],
  selectedVersion,
  onVersionChange,
  selectedDate,
  onDateChange,
}: MonitoringFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4 text-primary" />
        筛选条件
      </div>

      {/* 版本筛选 */}
      {versionOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            版本
          </span>
          <Select value={selectedVersion} onValueChange={onVersionChange}>
            <SelectTrigger className="h-8 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versionOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 日期筛选（按日） */}
      {onDateChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">日期</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 w-40 justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '选择日期'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && onDateChange(d)}
                disabled={(d) => d > new Date()}
                initialFocus
                locale={zhCN}
                className={cn('p-3 pointer-events-auto')}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

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
    </div>
  );
}
