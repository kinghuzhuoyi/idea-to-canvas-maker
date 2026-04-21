import { useState, useMemo } from 'react';
import { StrategyDetailMetrics, MetricTrendPoint, MonitoringFilter } from '@/types/project';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { MonitoringFilters } from './MonitoringFilters';
import { RejectReasonChart } from './RejectReasonChart';
import { DistributionChart } from './DistributionChart';
import { NodeVerdictChart } from './NodeVerdictChart';
import { RuleHitTable } from './RuleHitTable';
import { LatencyChart } from './LatencyChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  mockRejectReasons,
  mockCreditLimitDistribution,
  mockPricingDistribution,
  mockNodeVerdicts,
  mockRuleHits,
  generateLatencyTrend,
} from '@/data/mockMonitoringData';
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  DollarSign,
} from 'lucide-react';

interface MonitoringTabProps {
  metrics: StrategyDetailMetrics;
  trendData: {
    calls: MetricTrendPoint[];
    passRate: MetricTrendPoint[];
    errorRate: MetricTrendPoint[];
    tp99: MetricTrendPoint[];
  };
  showCreditScenario?: boolean; // 授信场景展示额度/定价分布
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function MonitoringTab({ metrics, trendData, showCreditScenario = true }: MonitoringTabProps) {
  const [filter, setFilter] = useState<MonitoringFilter>({
    businessCode: 'all',
    dateRange: 'today',
    customerTag: 'all',
  });

  // 注意：真实场景中 filter 变化会触发数据重拉，这里以 mock 数据保持静态
  const latencyTrend = useMemo(() => generateLatencyTrend(), []);
  const tp95 = metrics.tp95 ?? Math.round(metrics.tp99 * 0.75);
  const tp50 = metrics.tp50 ?? Math.round(metrics.tp99 * 0.35);
  const passRateCompare = metrics.passRateCompare ?? (metrics.passRate - metrics.sameTermPassRate);
  const errorRateCompare = metrics.errorRateCompare ?? -0.05;

  return (
    <div className="space-y-6">
      {/* 筛选条件 */}
      <MonitoringFilters filter={filter} onFilterChange={setFilter} />

      {/* 核心指标概览 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="订单数量"
          value={formatNumber(metrics.todayCalls)}
          trend={metrics.callsCompare}
          trendLabel="环比昨日同时段"
          variant="default"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <MetricCard
          title="订单通过率"
          value={metrics.passRate.toFixed(1)}
          unit="%"
          trend={passRateCompare}
          trendLabel="环比昨日全天"
          variant={metrics.passRate >= 98 ? 'success' : 'default'}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          title="订单异常率"
          value={metrics.errorRate.toFixed(2)}
          unit="%"
          trend={errorRateCompare}
          trendLabel="环比昨日全天"
          variant={metrics.errorRate <= 0.1 ? 'success' : metrics.errorRate <= 0.3 ? 'default' : 'danger'}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <MetricCard
          title="TP99 耗时"
          value={metrics.tp99}
          unit="ms"
          variant={metrics.tp99 <= 50 ? 'success' : metrics.tp99 <= 100 ? 'default' : 'warning'}
        />
      </div>

      {/* 通过率与调用量趋势 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              订单调用量趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={trendData.calls}
              title=""
              showArea
              height={200}
              className="border-0 p-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              通过率趋势（当前 vs 同期）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={trendData.passRate}
              title=""
              compareKey="compareValue"
              unit="%"
              height={200}
              className="border-0 p-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* 耗时数据 + 异常率 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LatencyChart data={latencyTrend} tp50={tp50} tp95={tp95} tp99={metrics.tp99} />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              订单异常率趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={trendData.errorRate}
              title=""
              color="hsl(var(--destructive))"
              unit="%"
              height={276}
              className="border-0 p-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* 拒绝原因分布 */}
      <RejectReasonChart data={mockRejectReasons} />

      {/* 授信场景：额度 + 定价分布 */}
      {showCreditScenario && (
        <div className="grid gap-4 lg:grid-cols-2">
          <DistributionChart
            title="授信额度分布"
            icon={<Wallet className="h-4 w-4 text-primary" />}
            data={mockCreditLimitDistribution}
            valueLabel="订单数"
          />
          <DistributionChart
            title="定价分布（年化利率）"
            icon={<DollarSign className="h-4 w-4 text-primary" />}
            data={mockPricingDistribution}
            valueLabel="订单数"
          />
        </div>
      )}

      {/* 节点通过率 */}
      <NodeVerdictChart data={mockNodeVerdicts} />

      {/* 规则命中排行 */}
      <RuleHitTable data={mockRuleHits} />
    </div>
  );
}
