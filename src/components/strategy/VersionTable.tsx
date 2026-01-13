import { useState } from 'react';
import { StrategyVersion, VersionStatus, UserRole } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  MoreHorizontal, 
  Play, 
  Copy, 
  RotateCcw, 
  History, 
  Eye, 
  Download,
  Trash2,
  Edit,
  FileText,
} from 'lucide-react';
import { VersionFilters } from './VersionFilters';
import { toast } from 'sonner';

interface VersionTableProps {
  versions: StrategyVersion[];
  userRole: UserRole;
  onPublish?: (version: StrategyVersion) => void;
  onCopy?: (version: StrategyVersion) => void;
  onRollback?: (version: StrategyVersion) => void;
  onViewHistory?: (version: StrategyVersion) => void;
  onView?: (version: StrategyVersion) => void;
  onExport?: (version: StrategyVersion) => void;
  onDelete?: (versions: StrategyVersion[]) => void;
  onEdit?: (version: StrategyVersion) => void;
}

const statusConfig: Record<VersionStatus, { label: string; variant: 'effective' | 'approving' | 'grayscale' | 'draft' | 'invalid' }> = {
  effective: { label: '生效中', variant: 'effective' },
  approving: { label: '发布审批中', variant: 'approving' },
  grayscale: { label: '灰度中', variant: 'grayscale' },
  draft: { label: '草稿', variant: 'draft' },
  invalid: { label: '失效', variant: 'invalid' },
};

export function VersionTable({ 
  versions, 
  userRole, 
  onPublish, 
  onCopy, 
  onRollback, 
  onViewHistory,
  onView,
  onExport,
  onDelete,
  onEdit,
}: VersionTableProps) {
  const canOperate = userRole === 'admin' || userRole === 'editor';
  
  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VersionStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'updatedAt' | 'versionNumber'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Filter out effective, approving, and grayscale versions (shown in cards)
  let tableVersions = versions.filter(
    v => v.status !== 'effective' && v.status !== 'approving' && v.status !== 'grayscale'
  );

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    tableVersions = tableVersions.filter(
      v => v.versionNumber.toLowerCase().includes(query) || 
           v.description.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    tableVersions = tableVersions.filter(v => v.status === statusFilter);
  }

  // Apply sort
  tableVersions = [...tableVersions].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'updatedAt') {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else {
      comparison = a.versionNumber.localeCompare(b.versionNumber);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: 'updatedAt' | 'versionNumber', direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(tableVersions.filter(v => v.status === 'draft').map(v => v.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    const selectedVersions = tableVersions.filter(v => selectedIds.has(v.id));
    if (selectedVersions.length > 0) {
      onDelete?.(selectedVersions);
      setSelectedIds(new Set());
      toast.success(`已删除 ${selectedVersions.length} 个草稿版本`);
    }
  };

  const draftVersions = tableVersions.filter(v => v.status === 'draft');
  const allDraftsSelected = draftVersions.length > 0 && draftVersions.every(v => selectedIds.has(v.id));
  const someDraftsSelected = draftVersions.some(v => selectedIds.has(v.id));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <VersionFilters
        onSearch={setSearchQuery}
        onStatusFilter={setStatusFilter}
        onSort={handleSort}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        sortField={sortField}
        sortDirection={sortDirection}
      />

      {/* Batch Actions */}
      {selectedIds.size > 0 && canOperate && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border animate-in slide-in-from-top-2">
          <span className="text-sm text-muted-foreground">
            已选择 <span className="font-medium text-foreground">{selectedIds.size}</span> 个版本
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBatchDelete}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            批量删除
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
          >
            取消选择
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {canOperate && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allDraftsSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="全选草稿"
                    className={someDraftsSelected && !allDraftsSelected ? 'data-[state=checked]:bg-primary/50' : ''}
                  />
                </TableHead>
              )}
              <TableHead className="w-[120px]">版本号</TableHead>
              <TableHead className="min-w-[150px]">版本描述</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="w-[100px]">创建人</TableHead>
              <TableHead className="w-[160px]">更新时间</TableHead>
              <TableHead className="w-[80px]">更新人</TableHead>
              <TableHead className="w-[60px] text-center">历史</TableHead>
              <TableHead className="w-[80px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableVersions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canOperate ? 9 : 8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8 opacity-50" />
                    <span>暂无版本数据</span>
                    {searchQuery && (
                      <Button variant="link" size="sm" onClick={() => setSearchQuery('')}>
                        清除搜索条件
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tableVersions.map((version) => {
                const status = statusConfig[version.status];
                const isSelected = selectedIds.has(version.id);
                const isHovered = hoveredRowId === version.id;
                const isDraft = version.status === 'draft';
                
                return (
                  <TableRow 
                    key={version.id}
                    className={`transition-colors ${isHovered ? 'bg-muted/50' : ''} ${isSelected ? 'bg-primary/5' : ''}`}
                    onMouseEnter={() => setHoveredRowId(version.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    {canOperate && (
                      <TableCell>
                        {isDraft && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(version.id, !!checked)}
                            aria-label={`选择 ${version.versionNumber}`}
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <span className="font-mono text-sm font-medium">{version.versionNumber}</span>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground max-w-[200px] truncate block cursor-default">
                              {version.description}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[300px]">
                            <p>{version.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {version.createdBy || version.updatedBy}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {version.updatedAt}
                    </TableCell>
                    <TableCell className="text-sm">
                      {version.updatedBy}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onViewHistory?.(version)}
                            >
                              <History className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>查看修改历史</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => onView?.(version)}>
                            <Eye className="h-4 w-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          {canOperate && (
                            <>
                              {isDraft && (
                                <>
                                  <DropdownMenuItem onClick={() => onEdit?.(version)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    编辑草稿
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onPublish?.(version)}>
                                    <Play className="h-4 w-4 mr-2" />
                                    发布版本
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => onCopy?.(version)}>
                                <Copy className="h-4 w-4 mr-2" />
                                复制版本
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExport?.(version)}>
                                <Download className="h-4 w-4 mr-2" />
                                版本导出
                              </DropdownMenuItem>
                              {version.status !== 'effective' && (
                                <DropdownMenuItem onClick={() => onRollback?.(version)}>
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  回滚到此版本
                                </DropdownMenuItem>
                              )}
                              {isDraft && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      onDelete?.([version]);
                                      toast.success(`草稿 ${version.versionNumber} 已删除`);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    删除草稿
                                  </DropdownMenuItem>
                                </>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      {tableVersions.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          共 {tableVersions.length} 个版本
        </div>
      )}
    </div>
  );
}
