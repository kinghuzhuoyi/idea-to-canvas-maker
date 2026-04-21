import { useState, useMemo } from 'react';
import { StrategyDetailMetrics, MetricTrendPoint, MonitoringFilter, MonitoringGranularity } from '@/types/project';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { MonitoringFilters } from './MonitoringFilters';
import { ChartGranularityToggle } from './ChartGranularityToggle';
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

/**
 * 可横向滚动的趋势图容器：分钟粒度下展开更宽以支持横向拖拉查看
 */
interface ScrollableTrendCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  data: MetricTrendPoint[];
  granularity: MonitoringGranularity;
  onGranularityChange: (g: MonitoringGranularity) => void;
  subLabel?: string;
  showArea?: boolean;
  compareKey?: string;
  color?: string;
  unit?: string;
  height?: number;
}

function ScrollableTrendCard({
  title,
  icon,
  data,
  granularity,
  onGranularityChange,
  subLabel,
  showArea,
  compareKey,
  color,
  unit,
  height = 220,
}: ScrollableTrendCardProps) {
  const isMinute = granularity === 'minute';
  const minWidth = isMinute ? Math.max(1200, data.length * 22) : undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            {icon}
            {title}
            {subLabel && (
              <span className="text-xs font-normal text-muted-foreground ml-2">{subLabel}</span>
            )}
          </CardTitle>
          <ChartGranularityToggle value={granularity} onChange={onGranularityChange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ minWidth }}>
            <TrendChart
              data={data}
              title=""
              showArea={showArea}
              compareKey={compareKey}
              color={color}
              unit={unit}
              height={height}
              className="border-0 p-0"
              xAxisInterval={isMinute ? 2 : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MonitoringTab({ metrics, showCreditScenario = true }: MonitoringTabProps) {
  const [filter, setFilter] = useState<MonitoringFilter>({
    businessCode: 'all',
    customerTag: 'all',
    granularity: 'hour',
  });

  // 每个趋势图独立的聚合粒度
  const [callsGran, setCallsGran] = useState<MonitoringGranularity>('hour');
  const [passRateGran, setPassRateGran] = useState<MonitoringGranularity>('hour');
  const [errorRateGran, setErrorRateGran] = useState<MonitoringGranularity>('hour');

  const callsTrend = useMemo(
    () => generateTrendByGranularity(metrics.todayCalls / 24, callsGran, 0.35),
    [metrics.todayCalls, callsGran],
  );
  const passRateTrend = useMemo(() => {
    const base = metrics.passRate;
    return generateTrendByGranularity(base, passRateGran, 0.02).map((p) => ({
      ...p,
      value: Math.min(100, Math.max(80, Number((base + (Math.random() - 0.5) * 2).toFixed(1)))),
      compareValue: Math.min(100, Math.max(80, Number((metrics.sameTermPassRate + (Math.random() - 0.5) * 2).toFixed(1)))),
    }));
  }, [metrics.passRate, metrics.sameTermPassRate, passRateGran]);
  const errorRateTrend = useMemo(() => {
    return generateTrendByGranularity(metrics.errorRate, errorRateGran, 0.5).map((p) => ({
      ...p,
      value: Number(Math.max(0, metrics.errorRate + (Math.random() - 0.5) * 0.2).toFixed(2)),
    }));
  }, [metrics.errorRate, errorRateGran]);

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
      <ScrollableTrendCard
        title="授信申请量趋势"
        icon={<FileCheck className="h-4 w-4 text-primary" />}
        data={callsTrend}
        granularity={callsGran}
        onGranularityChange={setCallsGran}
        subLabel={callsGran === 'hour' ? '按小时聚合 · 今日' : '按分钟聚合 · 最近 60 分钟（可横向拖动）'}
        showArea
        height={220}
      />

      {/* 通过率趋势 + 拒绝原因分布 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollableTrendCard
          title="审批通过率趋势"
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          data={passRateTrend}
          granularity={passRateGran}
          onGranularityChange={setPassRateGran}
          subLabel="当前 vs 同期"
          compareKey="compareValue"
          unit="%"
          height={240}
        />

        <RejectReasonChart data={mockRejectReasons} />
      </div>

      {/* 节点通过率 + 规则命中（两列并排） */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NodeVerdictChart data={mockNodeVerdicts} />
        <RuleHitTable data={mockRuleHits} />
      </div>

      {/* 授信场景：额度 + 定价分布 */}
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

      {/* 性能指标：耗时 + 异常率 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LatencyChart tp50={tp50} tp95={tp95} tp99={metrics.tp99} />
        <ScrollableTrendCard
          title="请求异常率趋势"
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          data={errorRateTrend}
          granularity={errorRateGran}
          onGranularityChange={setErrorRateGran}
          color="hsl(var(--destructive))"
          unit="%"
          height={276}
        />
      </div>
    </div>
  );
}
