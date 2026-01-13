import { useState } from 'react';
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
  Bell,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const canOperate = userRole === 'admin' || userRole === 'editor';
  const approvalInfo = version.approvalInfo;
  const isOverdue = approvalInfo?.isOverdue || false;

  const handleRemind = () => {
    toast.success(`已向审批人 ${approvalInfo?.approver} 发送催办提醒`);
  };

  // 默认审批节点
  const defaultNodes = [
    { id: '1', name: '发起', status: 'approved' as const },
    { id: '2', name: approvalInfo?.currentNode || '审批中', status: 'current' as const },
    { id: '3', name: '完成', status: 'pending' as const },
  ];

  const nodes = approvalInfo?.nodes || defaultNodes;

  const getNodeIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'current':
        return <Circle className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative rounded-lg border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/5 to-transparent p-5 shadow-sm">
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
            {isOverdue && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                超时
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            版本描述：{version.description}
          </p>

          {approvalInfo && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-4">
              {/* Header with approval ID and duration */}
              <div className="flex items-center justify-between flex-wrap gap-2">
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
                  审批停留时长：
                  <span className={`font-medium ${isOverdue ? 'text-destructive' : 'text-amber-600'}`}>
                    {approvalInfo.duration}
                  </span>
                </div>
              </div>

              {/* Multi-node Progress Indicator */}
              <div className="flex items-center gap-1 py-3">
                {nodes.map((node, index) => (
                  <div key={node.id} className="flex items-center flex-1 last:flex-none">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center gap-1">
                            {getNodeIcon(node.status)}
                            <span className={`text-xs ${
                              node.status === 'current' 
                                ? 'text-amber-600 font-medium' 
                                : node.status === 'approved'
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                            }`}>
                              {node.name}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {node.status === 'approved' && node.approver && (
                            <p>{node.approver} 已审批</p>
                          )}
                          {node.status === 'current' && (
                            <p>等待 {approvalInfo.approver} 审批</p>
                          )}
                          {node.status === 'pending' && (
                            <p>待处理</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {index < nodes.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        node.status === 'approved' ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Estimated completion time */}
              {approvalInfo.estimatedCompleteTime && (
                <div className="flex items-center gap-2 text-sm p-2 rounded bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                  <span>预计完成时间：{approvalInfo.estimatedCompleteTime}</span>
                </div>
              )}

              {/* Approval Details */}
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

              {/* Expandable Version Content Preview */}
              {isExpanded && (
                <div className="mt-3 p-3 rounded-lg bg-card border animate-in slide-in-from-top-2 duration-200">
                  <h5 className="text-sm font-medium text-foreground mb-2">版本内容预览</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• 更新时间：{version.updatedAt}</p>
                    <p>• 更新人：{version.updatedBy}</p>
                    <p>• 变更摘要：{version.description}</p>
                    {approvalInfo.remindCount !== undefined && approvalInfo.remindCount > 0 && (
                      <p className="text-amber-600">• 已催办 {approvalInfo.remindCount} 次</p>
                    )}
                  </div>
                </div>
              )}

              {/* Expand Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    收起预览
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    查看版本内容
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {canOperate && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemind}
                  className="gap-1.5"
                >
                  <Bell className="h-4 w-4" />
                  催办
                </Button>
              </TooltipTrigger>
              <TooltipContent>发送催办提醒给审批人</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
