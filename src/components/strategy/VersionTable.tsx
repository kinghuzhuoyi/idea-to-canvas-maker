import { StrategyVersion, VersionStatus, UserRole } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Copy, RotateCcw, History, Eye, Download } from 'lucide-react';

interface VersionTableProps {
  versions: StrategyVersion[];
  userRole: UserRole;
  onPublish?: (version: StrategyVersion) => void;
  onCopy?: (version: StrategyVersion) => void;
  onRollback?: (version: StrategyVersion) => void;
  onViewHistory?: (version: StrategyVersion) => void;
  onView?: (version: StrategyVersion) => void;
  onExport?: (version: StrategyVersion) => void;
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
}: VersionTableProps) {
  const canOperate = userRole === 'admin' || userRole === 'editor';

  // Filter out effective, approving, and grayscale versions (shown in cards)
  const tableVersions = versions.filter(
    v => v.status !== 'effective' && v.status !== 'approving' && v.status !== 'grayscale'
  );

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">版本号</TableHead>
            <TableHead>版本描述</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[160px]">更新时间</TableHead>
            <TableHead className="w-[80px]">更新人</TableHead>
            <TableHead className="w-[80px]">修改历史</TableHead>
            <TableHead className="w-[100px] text-right">版本操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableVersions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                暂无其他版本
              </TableCell>
            </TableRow>
          ) : (
            tableVersions.map((version) => {
              const status = statusConfig[version.status];
              return (
                <TableRow key={version.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">{version.versionNumber}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {version.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {version.updatedAt}
                  </TableCell>
                  <TableCell className="text-sm">
                    {version.updatedBy}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-primary"
                      onClick={() => onViewHistory?.(version)}
                    >
                      查看
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView?.(version)}>
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        {canOperate && (
                          <>
                            {version.status === 'draft' && (
                              <DropdownMenuItem onClick={() => onPublish?.(version)}>
                                <Play className="h-4 w-4 mr-2" />
                                发布版本
                              </DropdownMenuItem>
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
  );
}
