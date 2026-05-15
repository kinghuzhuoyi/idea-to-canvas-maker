import { useNavigate } from 'react-router-dom';
import { Strategy, PublishStatus } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Calendar, Hash, Activity, AlertTriangle, CheckCircle, Clock, Loader2, Timer, TrendingUp } from 'lucide-react';
import { UserRole } from '@/types/project';

interface StrategyCardProps {
  strategy: Strategy;
  userRole: UserRole;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const publishStatusConfig: Record<PublishStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ReactNode }> = {
  none: { label: '未发布', variant: 'outline', icon: null },
  approving: { label: '审批中', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  grayscale: { label: '灰度中', variant: 'default', icon: <Loader2 className="h-3 w-3" /> },
  published: { label: '已发布', variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
};

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function StrategyCard({ strategy, userRole, onView, onEdit, onDelete }: StrategyCardProps) {
  const navigate = useNavigate();
  const canEdit = userRole === 'admin' || userRole === 'editor';
  const canDelete = userRole === 'admin';
  const statusConfig = publishStatusConfig[strategy.publishStatus];
  const hasMetrics = strategy.metrics.todayCalls > 0;

  const handleCardClick = () => {
    navigate(`/project/${strategy.projectId}/strategy/${strategy.id}`);
  };

  return (
    <div 
      className="group card-elevated p-5 animate-slide-up hover:border-primary/20 flex flex-col h-full min-h-[220px] cursor-pointer transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between gap-4 mb-3 flex-shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{strategy.code}</span>
            </div>
            <Badge variant={strategy.referenced ? 'referenced' : 'unreferenced'}>
              {strategy.referenced ? '引用中' : '未引用'}
            </Badge>
            {strategy.publishStatus !== 'none' && (
              <Badge 
                variant={statusConfig.variant}
                className="gap-1"
              >
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            )}
          </div>
          <h4 className="font-medium text-foreground mb-1.5 truncate">
            {strategy.name}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">
            {strategy.description}
          </p>
        </div>
      </div>

      {/* 指标数据展示 - 固定高度区域 */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-center gap-4 py-3 border-t border-b border-border/50 mb-3 min-h-[52px]">
          {hasMetrics ? (
            <>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <span className="text-muted-foreground">今日调用</span>
                  <span className="ml-1.5 font-medium text-foreground">{formatNumber(strategy.metrics.todayCalls)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${strategy.metrics.errorRate > 0.2 ? 'text-destructive' : 'text-muted-foreground'}`} />
                <div className="text-sm">
                  <span className="text-muted-foreground">异常率</span>
                  <span className={`ml-1.5 font-medium ${strategy.metrics.errorRate > 0.2 ? 'text-destructive' : 'text-foreground'}`}>
                    {strategy.metrics.errorRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">暂无调用数据</div>
          )}
        </div>

        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>更新于 {strategy.updatedAt}</span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={(e) => { e.stopPropagation(); onView(); }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && onEdit && (
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {canDelete && onDelete && (
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
