import { StrategyVersion, UserRole } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  RefreshCw, 
  XCircle, 
  ExternalLink,
  User,
  Calendar,
  GitBranch,
} from 'lucide-react';

interface ApprovingVersionCardProps {
  version: StrategyVersion;
  userRole: UserRole;
  onRefresh?: () => void;
  onTerminate?: () => void;
}

export function ApprovingVersionCard({ 
  version, 
  userRole,
  onRefresh,
  onTerminate,
}: ApprovingVersionCardProps) {
  const canOperate = userRole === 'admin' || userRole === 'editor';
  const approvalInfo = version.approvalInfo;

  return (
    <div className="relative rounded-lg border-l-4 border-l-amber-500 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-lg font-semibold text-foreground">
              {version.versionNumber}
            </span>
            <Badge variant="approving" className="gap-1">
              <Clock className="h-3 w-3" />
              发布审批中
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            版本描述：{version.description}
          </p>

          {approvalInfo && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">OA审批进度</span>
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.preventDefault()}
                  >
                    {approvalInfo.approvalId}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">
                  审批停留时长：<span className="text-amber-600 font-medium">{approvalInfo.duration}</span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="flex items-center gap-2 py-2">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">发起</span>
                </div>
                <div className="flex-1 h-0.5 bg-primary" />
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-amber-500 ring-2 ring-amber-500/30 animate-pulse" />
                  <span className="text-xs text-amber-600 font-medium">{approvalInfo.currentNode}</span>
                </div>
                <div className="flex-1 h-0.5 bg-muted" />
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-xs text-muted-foreground">完成</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">发起人：</span>
                  <span className="text-foreground">{approvalInfo.initiatorId}（{approvalInfo.initiator}）</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">审批人：</span>
                  <span className="text-foreground">{approvalInfo.approverId}（{approvalInfo.approver}）</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">发起时间：</span>
                  <span className="text-foreground">{approvalInfo.initiatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">所在节点：</span>
                  <span className="text-amber-600 font-medium">{approvalInfo.currentNode}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {canOperate && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            刷新状态
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTerminate}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
            终止
          </Button>
        </div>
      )}
    </div>
  );
}
