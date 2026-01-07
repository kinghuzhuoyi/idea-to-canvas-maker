import { StrategyDetailMetrics, MetricTrendPoint } from '@/types/project';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface MonitoringTabProps {
  metrics: StrategyDetailMetrics;
  trendData: {
    calls: MetricTrendPoint[];
    passRate: MetricTrendPoint[];
    errorRate: MetricTrendPoint[];
    tp99: MetricTrendPoint[];
  };
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function MonitoringTab({ metrics, trendData }: MonitoringTabProps) {
  return (
    <div className="space-y-6">
      {/* 订单指标 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            订单指标
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              title="今日调用量"
              value={formatNumber(metrics.todayCalls)}
              trend={metrics.callsCompare}
              trendLabel="环比"
              variant="default"
            />
            <MetricCard
              title="通过数量"
              value={formatNumber(metrics.passCount)}
              variant="success"
            />
          </div>
          <TrendChart
            data={trendData.calls}
            title="近7日调用量趋势"
            showArea
            height={180}
          />
        </CardContent>
      </Card>

      {/* 执行情况 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            执行情况
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="通过率"
              value={metrics.passRate.toFixed(1)}
              unit="%"
              variant={metrics.passRate >= 98 ? 'success' : 'default'}
            />
            <MetricCard
              title="同期通过率"
              value={metrics.sameTermPassRate.toFixed(1)}
              unit="%"
              variant="default"
            />
            <MetricCard
              title="通过率提升"
              value={(metrics.passRate - metrics.sameTermPassRate).toFixed(1)}
              unit="%"
              variant={metrics.passRate > metrics.sameTermPassRate ? 'success' : 'warning'}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
          <TrendChart
            data={trendData.passRate}
            title="通过率趋势（当前 vs 同期）"
            compareKey="compareValue"
            unit="%"
            height={180}
          />
        </CardContent>
      </Card>

      {/* 运维指标 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            运维指标
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="异常数量"
              value={metrics.errorCount}
              variant={metrics.errorCount <= 10 ? 'success' : metrics.errorCount <= 30 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="异常率"
              value={metrics.errorRate.toFixed(2)}
              unit="%"
              variant={metrics.errorRate <= 0.1 ? 'success' : metrics.errorRate <= 0.3 ? 'default' : 'danger'}
            />
            <MetricCard
              title="TP99 耗时"
              value={metrics.tp99}
              unit="ms"
              variant={metrics.tp99 <= 50 ? 'success' : metrics.tp99 <= 100 ? 'default' : 'warning'}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TrendChart
              data={trendData.errorRate}
              title="异常率趋势"
              color="hsl(var(--destructive))"
              unit="%"
              height={160}
            />
            <TrendChart
              data={trendData.tp99}
              title="TP99 耗时趋势"
              color="hsl(var(--chart-3))"
              unit="ms"
              height={160}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
