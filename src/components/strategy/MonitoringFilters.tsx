import { useState } from 'react';
import { MonitoringFilter } from '@/types/project';
import { businessCodeOptions } from '@/data/mockMonitoringData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Filter, Calendar as CalendarIcon, GitBranch, Check, ChevronsUpDown, Briefcase } from 'lucide-react';
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
  const [bizOpen, setBizOpen] = useState(false);
  const currentBiz = businessCodeOptions.find((o) => o.value === filter.businessCode);

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

      {/* 业务场景：可检索 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          业务场景
        </span>
        <Popover open={bizOpen} onOpenChange={setBizOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-8 w-60 justify-between font-normal"
            >
              <span className="truncate">{currentBiz?.label ?? '选择业务场景'}</span>
              <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 bg-popover" align="start">
            <Command>
              <CommandInput placeholder="搜索 business_code 或名称" className="h-9" />
              <CommandList>
                <CommandEmpty>未找到业务场景</CommandEmpty>
                <CommandGroup>
                  {businessCodeOptions.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => {
                        onFilterChange({ ...filter, businessCode: opt.value });
                        setBizOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-3.5 w-3.5',
                          filter.businessCode === opt.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{opt.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
