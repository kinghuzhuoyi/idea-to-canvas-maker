import { StrategyVersion, UserRole } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  RefreshCw, 
  Percent,
  RotateCcw,
  Rocket,
  Settings,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  User,
} from 'lucide-react';

interface GrayscaleVersionCardProps {
  version: StrategyVersion;
  userRole: UserRole;
  onRefresh?: () => void;
  onAdjustTraffic?: () => void;
  onFullPublish?: () => void;
  onRollback?: () => void;
}

export function GrayscaleVersionCard({ 
  version, 
  userRole,
  onRefresh,
  onAdjustTraffic,
  onFullPublish,
  onRollback,
}: GrayscaleVersionCardProps) {
  const canOperate = userRole === 'admin' || userRole === 'editor';
  const grayscaleInfo = version.grayscaleInfo;

  return (
    <div className="relative rounded-lg border-l-4 border-l-success bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-lg font-semibold text-foreground">
              {version.versionNumber}
            </span>
            <Badge variant="grayscale" className="gap-1">
              <Percent className="h-3 w-3" />
              灰度中
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            版本描述：{version.description}
          </p>

          {grayscaleInfo && (
            <div className="space-y-4">
              {/* Grayscale info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">灰度运行信息</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground block text-xs">开始时间</span>
                      <span className="text-foreground">{grayscaleInfo.startTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground block text-xs">运行时长</span>
                      <span className="text-foreground">{grayscaleInfo.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-success" />
                    <div>
                      <span className="text-muted-foreground block text-xs">灰度流量</span>
                      <span className="text-success font-medium">{grayscaleInfo.trafficRatio}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground block text-xs">操作人</span>
                      <span className="text-foreground">{grayscaleInfo.operator}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grayscale metrics */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-3">灰度指标概览</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
                    <span className="text-2xl font-bold text-foreground">
                      {grayscaleInfo.metrics.callCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度调用量</span>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <TrendingUp className="h-5 w-5 text-success mx-auto mb-1" />
                    <span className="text-2xl font-bold text-success">
                      {grayscaleInfo.metrics.passRate}%
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度通过率</span>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-2xl font-bold text-amber-500">
                      {grayscaleInfo.metrics.errorRate}%
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度异常率</span>
                  </div>
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
            onClick={onAdjustTraffic}
            className="gap-1.5"
          >
            <Settings className="h-4 w-4" />
            调整流量
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onFullPublish}
            className="gap-1.5"
          >
            <Rocket className="h-4 w-4" />
            全量发布
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRollback}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <RotateCcw className="h-4 w-4" />
            回滚
          </Button>
        </div>
      )}
    </div>
  );
}
