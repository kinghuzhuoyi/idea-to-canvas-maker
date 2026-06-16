import { useMemo } from 'react';
import { CustomMetric } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Sparkles } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '@/data/mockMonitoringData';

interface CustomMetricCardProps {
  metric: CustomMetric;
  onEdit: () => void;
  onDelete: () => void;
}

// Mock 出该指标各分箱的累计值
function getBinLabels(metric: CustomMetric): string[] {
  if (metric.fieldType === 'number') {
    return (metric.bins.ranges ?? []).map((r) => r.label);
  }
  return (metric.bins.enumMap ?? []).map((b) => b.label);
}

// 简单 hash 让 mock 值在不同字段间稳定
function hashSeed(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function generateBinValues(metric: CustomMetric) {
  const labels = getBinLabels(metric);
  const seed = hashSeed(metric.id);
  return labels.map((label, i) => {
    const v = ((seed + i * 137) % 900) + 100;
    return { name: label, value: v };
  });
}

function generateTrendBins(metric: CustomMetric) {
  const labels = getBinLabels(metric);
  const seed = hashSeed(metric.id);
  // 24 小时
  return Array.from({ length: 24 }, (_, h) => {
    const row: Record<string, any> = { time: `${h.toString().padStart(2, '0')}:00` };
    labels.forEach((label, i) => {
      row[label] = ((seed + h * 17 + i * 41) % 80) + 20;
    });
    return row;
  });
}

export function CustomMetricCard({ metric, onEdit, onDelete }: CustomMetricCardProps) {
  const data = useMemo(() => generateBinValues(metric), [metric]);
  const trendData = useMemo(() => generateTrendBins(metric), [metric]);
  const total = data.reduce((s, d) => s + d.value, 0);
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const labels = getBinLabels(metric);

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{metric.fieldLabel}</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              {metric.fieldCode}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {metric.chartType === 'pie' && (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name) => [
                    `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  height={200}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {metric.chartType === 'rankBar' && (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
                width={labels.length > 10 ? 120 : 90}
                interval={0}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {sortedData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {metric.chartType === 'trendBar' && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trendData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" interval={2} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  maxHeight: labels.length > 8 ? '48px' : '24px',
                  overflowY: labels.length > 8 ? 'auto' : 'visible',
                  paddingRight: '4px',
                }}
                iconSize={8}
              />
              {labels.map((label, i) => (
                <Bar key={label} dataKey={label} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
