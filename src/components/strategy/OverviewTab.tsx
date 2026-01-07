import { Strategy, StrategyDetailMetrics, VersionReleaseRecord, StrategyChangeRecord } from '@/types/project';
import { MetricCard } from './MetricCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  GitBranch, 
  AlertTriangle,
  Activity,
  Timer,
  TrendingUp,
} from 'lucide-react';

interface OverviewTabProps {
  strategy: Strategy;
  metrics: StrategyDetailMetrics;
  releaseRecords: VersionReleaseRecord[];
  changeRecords: StrategyChangeRecord[];
}

const actionLabels: Record<string, { label: string; color: string }> = {
  published: { label: '发布', color: 'text-emerald-600' },
  rollback: { label: '回滚', color: 'text-amber-600' },
  grayscale: { label: '灰度', color: 'text-blue-600' },
};

const changeTypeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  version_release: { label: '版本发布', icon: <GitBranch className="h-3 w-3" /> },
  status_change: { label: '状态变更', icon: <Activity className="h-3 w-3" /> },
  config_update: { label: '配置更新', icon: <Timer className="h-3 w-3" /> },
};

export function OverviewTab({ strategy, metrics, releaseRecords, changeRecords }: OverviewTabProps) {
  const getStatusBadge = () => {
    switch (strategy.publishStatus) {
      case 'approving':
        return (
          <Badge variant="secondary" className="gap-1 text-sm py-1 px-3">
            <Clock className="h-4 w-4" />
            审批中
          </Badge>
        );
      case 'grayscale':
        return (
          <Badge variant="default" className="gap-1 text-sm py-1 px-3 bg-blue-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            灰度中
          </Badge>
        );
      case 'published':
        return (
          <Badge variant="default" className="gap-1 text-sm py-1 px-3 bg-emerald-500">
            <CheckCircle className="h-4 w-4" />
            已发布
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-sm py-1 px-3">
            未发布
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 当前发布状态 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">当前状态</CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* 最近变更 */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                最近变更
              </h4>
              <div className="space-y-3">
                {changeRecords.slice(0, 4).map((record) => (
                  <div key={record.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 text-muted-foreground">
                      {changeTypeLabels[record.type]?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground truncate">{record.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {record.operator} · {record.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 版本发布记录 */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                版本发布记录
              </h4>
              <div className="space-y-3">
                {releaseRecords.slice(0, 4).map((record) => (
                  <div key={record.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground">{record.versionNumber}</span>
                      <span className={actionLabels[record.action]?.color}>
                        {actionLabels[record.action]?.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{record.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 指标概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            指标概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="通过率"
              value={metrics.passRate.toFixed(1)}
              unit="%"
              trend={metrics.passRate - metrics.sameTermPassRate}
              trendLabel="较同期"
              variant={metrics.passRate >= 98 ? 'success' : metrics.passRate >= 95 ? 'default' : 'warning'}
              icon={<CheckCircle className="h-4 w-4" />}
            />
            <MetricCard
              title="异常率"
              value={metrics.errorRate.toFixed(2)}
              unit="%"
              trend={-0.05}
              trendLabel="较昨日"
              variant={metrics.errorRate <= 0.1 ? 'success' : metrics.errorRate <= 0.3 ? 'default' : 'danger'}
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            <MetricCard
              title="TP99 耗时"
              value={metrics.tp99}
              unit="ms"
              trend={-2.5}
              trendLabel="较昨日"
              variant={metrics.tp99 <= 50 ? 'success' : metrics.tp99 <= 100 ? 'default' : 'warning'}
              icon={<Timer className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
