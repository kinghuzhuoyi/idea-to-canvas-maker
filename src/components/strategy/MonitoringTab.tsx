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
  generateTrendByGranularity,
} from '@/data/mockMonitoringData';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Percent,
  Gauge,
} from 'lucide-react';

interface MonitoringTabProps {
  metrics: StrategyDetailMetrics;
  trendData: {
    calls: MetricTrendPoint[];
    passRate: MetricTrendPoint[];
    errorRate: MetricTrendPoint[];
    tp99: MetricTrendPoint[];
  };
  showCreditScenario?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function MonitoringTab({ metrics, showCreditScenario = true }: MonitoringTabProps) {
  const [filter, setFilter] = useState<MonitoringFilter>({
    businessCode: 'all',
    customerTag: 'all',
    granularity: 'hour',
  });

  // 按粒度重新生成当日趋势数据
  const callsTrend = useMemo(
    () => generateTrendByGranularity(metrics.todayCalls / 24, filter.granularity, 0.35),
    [metrics.todayCalls, filter.granularity],
  );
  const passRateTrend = useMemo(() => {
    const base = metrics.passRate;
    return generateTrendByGranularity(base, filter.granularity, 0.02).map((p) => ({
      ...p,
      value: Math.min(100, Math.max(80, Number((base + (Math.random() - 0.5) * 2).toFixed(1)))),
      compareValue: Math.min(100, Math.max(80, Number((metrics.sameTermPassRate + (Math.random() - 0.5) * 2).toFixed(1)))),
    }));
  }, [metrics.passRate, metrics.sameTermPassRate, filter.granularity]);
  const errorRateTrend = useMemo(() => {
    return generateTrendByGranularity(metrics.errorRate, filter.granularity, 0.5).map((p) => ({
      ...p,
      value: Number(Math.max(0, metrics.errorRate + (Math.random() - 0.5) * 0.2).toFixed(2)),
    }));
  }, [metrics.errorRate, filter.granularity]);
  const latencyTrend = useMemo(() => generateLatencyTrend(filter.granularity), [filter.granularity]);

  const tp95 = metrics.tp95 ?? Math.round(metrics.tp99 * 0.75);
  const tp50 = metrics.tp50 ?? Math.round(metrics.tp99 * 0.35);
  const passRateCompare = metrics.passRateCompare ?? (metrics.passRate - metrics.sameTermPassRate);
  const errorRateCompare = metrics.errorRateCompare ?? -0.05;

  return (
    <div className="space-y-6">
      {/* 筛选条件 */}
      <MonitoringFilters filter={filter} onFilterChange={setFilter} />

      {/* 核心指标概览 —— 业务相关度排序：数量 → 通过率 → 异常率 → 耗时 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="授信申请数"
          value={formatNumber(metrics.todayCalls)}
          trend={metrics.callsCompare}
          trendLabel="环比昨日同时段"
          variant="default"
          icon={<FileCheck className="h-4 w-4" />}
        />
        <MetricCard
          title="审批通过率"
          value={metrics.passRate.toFixed(1)}
          unit="%"
          trend={passRateCompare}
          trendLabel="环比昨日全天"
          variant={metrics.passRate >= 98 ? 'success' : 'default'}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          title="请求异常率"
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
          icon={<Gauge className="h-4 w-4" />}
        />
      </div>

      {/* 业务量趋势 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            授信申请量趋势
            <span className="text-xs font-normal text-muted-foreground ml-2">
              {filter.granularity === 'hour' ? '按小时聚合 · 今日' : '按分钟聚合 · 最近 60 分钟'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart
            data={callsTrend}
            title=""
            showArea
            height={220}
            className="border-0 p-0"
          />
        </CardContent>
      </Card>

      {/* 通过率趋势 + 拒绝原因分布（业务含义相近，并排展示） */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              审批通过率趋势
              <span className="text-xs font-normal text-muted-foreground ml-2">
                当前 vs 同期
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={passRateTrend}
              title=""
              compareKey="compareValue"
              unit="%"
              height={240}
              className="border-0 p-0"
            />
          </CardContent>
        </Card>

        <RejectReasonChart data={mockRejectReasons} />
      </div>

      {/* 节点通过率 + 规则命中（规则链路相关，紧邻） */}
      <NodeVerdictChart data={mockNodeVerdicts} />
      <RuleHitTable data={mockRuleHits} />

      {/* 授信场景：额度 + 定价分布（业务产出） */}
      {showCreditScenario && (
        <div className="grid gap-4 lg:grid-cols-2">
          <DistributionChart
            title="授信额度分布"
            icon={<CreditCard className="h-4 w-4 text-primary" />}
            data={mockCreditLimitDistribution}
            valueLabel="申请数"
          />
          <DistributionChart
            title="定价分布（年化利率）"
            icon={<Percent className="h-4 w-4 text-primary" />}
            data={mockPricingDistribution}
            valueLabel="申请数"
          />
        </div>
      )}

      {/* 性能指标：耗时 + 异常率（系统健康度，放在末尾） */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LatencyChart data={latencyTrend} tp50={tp50} tp95={tp95} tp99={metrics.tp99} />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              请求异常率趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              data={errorRateTrend}
              title=""
              color="hsl(var(--destructive))"
              unit="%"
              height={276}
              className="border-0 p-0"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
