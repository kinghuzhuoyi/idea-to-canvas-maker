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
import { MoreHorizontal, Play, Copy, RotateCcw, History, Eye } from 'lucide-react';

interface VersionTableProps {
  versions: StrategyVersion[];
  userRole: UserRole;
  onPublish?: (version: StrategyVersion) => void;
  onCopy?: (version: StrategyVersion) => void;
  onRollback?: (version: StrategyVersion) => void;
  onViewHistory?: (version: StrategyVersion) => void;
  onView?: (version: StrategyVersion) => void;
}

const statusConfig: Record<VersionStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  effective: { label: '生效中', variant: 'default' },
  grayscale: { label: '灰度中', variant: 'secondary' },
  draft: { label: '草稿', variant: 'outline' },
};

export function VersionTable({ 
  versions, 
  userRole, 
  onPublish, 
  onCopy, 
  onRollback, 
  onViewHistory,
  onView,
}: VersionTableProps) {
  const canOperate = userRole === 'admin' || userRole === 'editor';

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">版本号</TableHead>
            <TableHead>版本描述</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[160px]">更新时间</TableHead>
            <TableHead className="w-[100px]">更新人</TableHead>
            <TableHead className="w-[80px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => {
            const status = statusConfig[version.status];
            return (
              <TableRow key={version.id}>
                <TableCell>
                  <span className="font-mono text-sm font-medium">{version.versionNumber}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">
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
                      <DropdownMenuItem onClick={() => onViewHistory?.(version)}>
                        <History className="h-4 w-4 mr-2" />
                        修改历史
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
          })}
        </TableBody>
      </Table>
    </div>
  );
}
