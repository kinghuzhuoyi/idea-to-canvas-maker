import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LatencyTrendPoint, generateLatencyTrend } from '@/data/mockMonitoringData';
import { Timer } from 'lucide-react';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LatencyChartProps {
  tp50: number;
  tp95: number;
  tp99: number;
  initialData?: LatencyTrendPoint[];
}

export function LatencyChart({ tp50, tp95, tp99 }: LatencyChartProps) {
  const data = useMemo(() => generateLatencyTrend('hour'), []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            耗时数据（TP50 / TP95 / TP99）
            <span className="text-xs font-normal text-muted-foreground ml-2">按小时</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-xs text-muted-foreground mb-1">TP50</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground tabular-nums">{tp50}</span>
              <span className="text-xs text-muted-foreground">ms</span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-xs text-muted-foreground mb-1">TP95</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground tabular-nums">{tp95}</span>
              <span className="text-xs text-muted-foreground">ms</span>
            </div>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="text-xs text-muted-foreground mb-1">TP99</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground tabular-nums">{tp99}</span>
              <span className="text-xs text-muted-foreground">ms</span>
            </div>
          </div>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={8}
              />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [`${value}ms`, name.toUpperCase()]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v) => v.toUpperCase()} />
                <Line type="monotone" dataKey="tp50" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tp95" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="tp99" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
