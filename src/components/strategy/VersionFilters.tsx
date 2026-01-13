import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { VersionStatus } from '@/types/project';

interface VersionFiltersProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: VersionStatus | 'all') => void;
  onSort: (field: 'updatedAt' | 'versionNumber', direction: 'asc' | 'desc') => void;
  searchQuery: string;
  statusFilter: VersionStatus | 'all';
  sortField: 'updatedAt' | 'versionNumber';
  sortDirection: 'asc' | 'desc';
}

export function VersionFilters({
  onSearch,
  onStatusFilter,
  onSort,
  searchQuery,
  statusFilter,
  sortField,
  sortDirection,
}: VersionFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch('');
  };

  const toggleSort = (field: 'updatedAt' | 'versionNumber') => {
    if (sortField === field) {
      onSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'desc');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索版本号或描述..."
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={handleClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilter(value as VersionStatus | 'all')}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="版本状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="draft">草稿</SelectItem>
          <SelectItem value="invalid">失效</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant={sortField === 'updatedAt' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => toggleSort('updatedAt')}
          className="gap-1"
        >
          更新时间
          <ArrowUpDown className={`h-3 w-3 ${sortField === 'updatedAt' ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>
        <Button
          variant={sortField === 'versionNumber' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => toggleSort('versionNumber')}
          className="gap-1"
        >
          版本号
          <ArrowUpDown className={`h-3 w-3 ${sortField === 'versionNumber' ? 'text-primary' : 'text-muted-foreground'}`} />
        </Button>
      </div>
    </div>
  );
}
