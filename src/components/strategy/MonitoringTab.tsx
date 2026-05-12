import { useState, useMemo } from 'react';
import {
  StrategyDetailMetrics,
  MetricTrendPoint,
  MonitoringFilter,
  MonitoringGranularity,
  StrategyVersion,
} from '@/types/project';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { MonitoringFilters } from './MonitoringFilters';
import { ChartGranularityToggle } from './ChartGranularityToggle';
import { RejectReasonChart } from './RejectReasonChart';

import { NodeVerdictChart } from './NodeVerdictChart';
import { RuleHitTable } from './RuleHitTable';
import { LatencyChart } from './LatencyChart';
import { CustomMetricsModule } from './CustomMetricsModule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  mockRejectReasons,
  mockNodeVerdicts,
  mockRuleHits,
  generateTrendByGranularity,
} from '@/data/mockMonitoringData';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Gauge,
} from 'lucide-react';
import { toast } from 'sonner';

interface MonitoringTabProps {
  metrics: StrategyDetailMetrics;
  trendData: {
    calls: MetricTrendPoint[];
    passRate: MetricTrendPoint[];
    errorRate: MetricTrendPoint[];
    tp99: MetricTrendPoint[];
  };
  showCreditScenario?: boolean;
  versions?: StrategyVersion[];
  strategyId?: string;
}

function formatNumber(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

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

function todayDate() {
  return new Date();
}

export function MonitoringTab({
  metrics,
  showCreditScenario = true,
  versions = [],
  strategyId = 'default',
}: MonitoringTabProps) {
  const [filter, setFilter] = useState<MonitoringFilter>({
    businessCode: 'all',
    granularity: 'hour',
  });

  // 全局：版本 + 日期
  const versionOptions = useMemo(() => {
    const opts = [{ value: 'all', label: '全部版本' }];
    versions.forEach((v) => {
      const tag =
        v.status === 'effective'
          ? '生效'
          : v.status === 'grayscale'
          ? '灰度'
          : v.status === 'approving'
          ? '审批中'
          : v.status === 'draft'
          ? '草稿'
          : '已失效';
      opts.push({ value: v.id, label: `${v.versionNumber} · ${tag}` });
    });
    return opts;
  }, [versions]);

  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate());

  const [callsGran, setCallsGran] = useState<MonitoringGranularity>('hour');
  // 通过率趋势：仅按小时
  const passRateGran: MonitoringGranularity = 'hour';
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
  // TP99 环比昨日：mock 一个 -8% ~ +8% 的对比
  const tp99Compare = useMemo(() => Number(((Math.random() - 0.5) * 16).toFixed(1)), [metrics.tp99]);

  // 跳转日志（toast）
  const jumpToLog = (label: string, params: Record<string, string>) => {
    const paramStr = Object.entries(params).map(([k, v]) => `${k}=${v}`).join(' & ');
    toast.info(`跳转到日志：${label}`, { description: paramStr });
  };

  const versionLabel =
    selectedVersion === 'all'
      ? '全部版本'
      : versionOptions.find((o) => o.value === selectedVersion)?.label ?? '';

  return (
    <div className="space-y-6">
      {/* 全局筛选条件 */}
      <MonitoringFilters
        filter={filter}
        onFilterChange={setFilter}
        versionOptions={versionOptions}
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 当前作用范围提示 */}
      <div className="text-xs text-muted-foreground -mt-3">
        当前数据范围：<span className="text-foreground font-medium">{versionLabel}</span> ·{' '}
        <span className="text-foreground font-medium">
          {selectedDate.toISOString().slice(0, 10)}
        </span>
      </div>

      {/* 核心指标概览 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="申请数"
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
          variant={metrics.errorRate <= 0.1 ? 'success' : metrics.errorRate <= 0.3 ? 'default' : 'danger'}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <MetricCard
          title="TP99 耗时"
          value={metrics.tp99}
          unit="ms"
          trend={tp99Compare}
          trendLabel="环比昨日"
          variant={metrics.tp99 <= 50 ? 'success' : metrics.tp99 <= 100 ? 'default' : 'warning'}
          icon={<Gauge className="h-4 w-4" />}
        />
      </div>

      {/* 业务量趋势：今日 vs 昨日 */}
      <ScrollableTrendCard
        title="授信申请量趋势"
        icon={<FileCheck className="h-4 w-4 text-primary" />}
        data={callsTrend}
        granularity={callsGran}
        onGranularityChange={setCallsGran}
        subLabel="今日 vs 昨日同时段"
        compareKey="compareValue"
        showArea
        height={220}
      />

      {/* 通过率趋势 + 拒绝原因分布 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              审批通过率趋势
              <span className="text-xs font-normal text-muted-foreground ml-2">
                当前 vs 同期 · 按小时
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

        <RejectReasonChart
          data={mockRejectReasons}
          onItemClick={(item) =>
            jumpToLog(`拒绝原因 - ${item.label}`, {
              reject_code: item.code,
              version: selectedVersion,
              date: selectedDate.toISOString().slice(0, 10),
            })
          }
        />
      </div>

      {/* 节点通过率 + 规则命中（两列并排） */}
      <div className="grid gap-4 lg:grid-cols-2">
        <NodeVerdictChart
          data={mockNodeVerdicts}
          onNodeClick={(node) =>
            jumpToLog(`节点拒绝 - ${node.nodeName}`, {
              node_id: node.nodeId,
              version: selectedVersion,
              date: selectedDate.toISOString().slice(0, 10),
            })
          }
        />
        <RuleHitTable
          data={mockRuleHits}
          totalApplications={metrics.todayCalls}
          onRowClick={(rule) =>
            jumpToLog(`规则命中 - ${rule.ruleName}`, {
              rule_code: rule.ruleCode,
              version: selectedVersion,
              date: selectedDate.toISOString().slice(0, 10),
            })
          }
        />
      </div>

      {/* 性能指标 */}
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

      {/* 自定义指标 */}
      <div className="pt-2">
        <CustomMetricsModule storageKey={`custom_metrics_${strategyId}`} />
      </div>
    </div>
  );
}
