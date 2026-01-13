import { StrategyVersion, UserRole, GrayscaleStage } from '@/types/project';
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
  TrendingDown,
  AlertTriangle,
  BarChart3,
  User,
  Pause,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { GrayscaleProgressBar } from './GrayscaleProgressBar';

interface GrayscaleVersionCardProps {
  version: StrategyVersion;
  userRole: UserRole;
  onRefresh?: () => void;
  onAdjustTraffic?: () => void;
  onFullPublish?: () => void;
  onRollback?: () => void;
}

const stageConfig: Record<GrayscaleStage, { label: string; color: string }> = {
  observing: { label: '观察期', color: 'bg-blue-500' },
  scaling: { label: '扩量期', color: 'bg-amber-500' },
  stable: { label: '稳定期', color: 'bg-emerald-500' },
};

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
  const stage = grayscaleInfo?.stage || 'observing';
  const stageInfo = stageConfig[stage];
  const isPaused = grayscaleInfo?.isPaused || false;

  // 计算指标趋势
  const getTrend = (current: number, compare?: number) => {
    if (!compare) return { icon: Minus, color: 'text-muted-foreground', value: '-' };
    const diff = current - compare;
    const percent = ((diff / compare) * 100).toFixed(1);
    if (diff > 0) return { icon: ArrowUpRight, color: 'text-emerald-500', value: `+${percent}%` };
    if (diff < 0) return { icon: ArrowDownRight, color: 'text-destructive', value: `${percent}%` };
    return { icon: Minus, color: 'text-muted-foreground', value: '0%' };
  };

  // 检查异常率是否超阈值
  const isErrorRateHigh = grayscaleInfo?.metrics.errorRate && grayscaleInfo.metrics.errorRate > (grayscaleInfo.successCriteria?.maxErrorRate || 1);

  const handlePauseToggle = () => {
    if (isPaused) {
      toast.success('灰度已恢复');
    } else {
      toast.success('灰度已暂停');
    }
  };

  return (
    <div className={`relative rounded-lg border-l-4 ${isPaused ? 'border-l-muted' : 'border-l-emerald-500'} bg-gradient-to-r ${isPaused ? 'from-muted/20' : 'from-emerald-500/5'} to-transparent p-5 shadow-sm`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-lg font-semibold text-foreground">
              {version.versionNumber}
            </span>
            <Badge variant="grayscale" className="gap-1">
              <Percent className="h-3 w-3" />
              灰度中
            </Badge>
            <Badge variant="outline" className={`gap-1 ${stageInfo.color} bg-opacity-10`}>
              <span className={`h-2 w-2 rounded-full ${stageInfo.color}`} />
              {stageInfo.label}
            </Badge>
            {isPaused && (
              <Badge variant="secondary" className="gap-1">
                <Pause className="h-3 w-3" />
                已暂停
              </Badge>
            )}
            {isErrorRateHigh && (
              <Badge variant="destructive" className="gap-1 animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                异常率过高
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            版本描述：{version.description}
          </p>

          {grayscaleInfo && (
            <div className="space-y-4">
              {/* Traffic Progress Bar */}
              <GrayscaleProgressBar 
                ratio={grayscaleInfo.trafficRatio} 
                isPaused={isPaused}
              />

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
                    <Percent className="h-4 w-4 text-emerald-500" />
                    <div>
                      <span className="text-muted-foreground block text-xs">灰度流量</span>
                      <span className="text-emerald-500 font-medium">{grayscaleInfo.trafficRatio}%</span>
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

              {/* Grayscale metrics with comparison */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-foreground">灰度指标概览</h4>
                  {grayscaleInfo.compareMetrics && (
                    <span className="text-xs text-muted-foreground">对比生效版本</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Call Count */}
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
                    <span className="text-2xl font-bold text-foreground">
                      {grayscaleInfo.metrics.callCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度调用量</span>
                    {grayscaleInfo.compareMetrics && (
                      <div className="mt-1 flex items-center justify-center gap-1">
                        {(() => {
                          const trend = getTrend(grayscaleInfo.metrics.callCount, grayscaleInfo.compareMetrics.callCount);
                          return (
                            <span className={`text-xs ${trend.color}`}>
                              {trend.value}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Pass Rate */}
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <span className="text-2xl font-bold text-emerald-500">
                      {grayscaleInfo.metrics.passRate}%
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度通过率</span>
                    {grayscaleInfo.compareMetrics && (
                      <div className="mt-1 flex items-center justify-center gap-1">
                        {(() => {
                          const trend = getTrend(grayscaleInfo.metrics.passRate, grayscaleInfo.compareMetrics.passRate);
                          const TrendIcon = trend.icon;
                          return (
                            <>
                              <TrendIcon className={`h-3 w-3 ${trend.color}`} />
                              <span className={`text-xs ${trend.color}`}>{trend.value}</span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Error Rate */}
                  <div className={`text-center p-3 bg-card rounded-lg border ${isErrorRateHigh ? 'border-destructive ring-1 ring-destructive' : ''}`}>
                    <AlertTriangle className={`h-5 w-5 mx-auto mb-1 ${isErrorRateHigh ? 'text-destructive' : 'text-amber-500'}`} />
                    <span className={`text-2xl font-bold ${isErrorRateHigh ? 'text-destructive' : 'text-amber-500'}`}>
                      {grayscaleInfo.metrics.errorRate}%
                    </span>
                    <span className="text-xs text-muted-foreground block">灰度异常率</span>
                    {grayscaleInfo.successCriteria && (
                      <div className="mt-1">
                        <span className="text-xs text-muted-foreground">
                          阈值: ≤{grayscaleInfo.successCriteria.maxErrorRate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Success Criteria */}
              {grayscaleInfo.successCriteria && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                  <span className="text-primary font-medium">全量发布条件：</span>
                  <span className="text-muted-foreground">
                    通过率 ≥ {grayscaleInfo.successCriteria.minPassRate}%，
                    异常率 ≤ {grayscaleInfo.successCriteria.maxErrorRate}%，
                    运行时长 ≥ {grayscaleInfo.successCriteria.minDuration}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {canOperate && (
        <div className="flex items-center justify-end gap-2 mt-4 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePauseToggle}
                  className="gap-1.5"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      恢复灰度
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      暂停灰度
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPaused ? '恢复灰度流量' : '暂停灰度流量，所有请求走生效版本'}
              </TooltipContent>
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
