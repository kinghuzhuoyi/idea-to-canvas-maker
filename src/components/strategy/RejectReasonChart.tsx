import { RejectReasonItem } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XCircle, FileSearch } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/data/mockMonitoringData';
import { cn } from '@/lib/utils';

interface RejectReasonChartProps {
  data: RejectReasonItem[];
  onItemClick?: (item: RejectReasonItem) => void;
}

export function RejectReasonChart({ data, onItemClick }: RejectReasonChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <XCircle className="h-4 w-4 text-destructive" />
          拒绝原因分布
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            总拒绝 {total.toLocaleString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 items-center">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  onClick={(d: any) => onItemClick?.(d?.payload as RejectReasonItem)}
                  style={{ cursor: onItemClick ? 'pointer' : undefined }}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, _name, props) => [
                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                    props.payload.label,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-sm">
            {data.map((item, i) => (
              <div
                key={item.code}
                className={cn(
                  'group flex items-center gap-2 rounded-md px-1 py-0.5 -mx-1',
                  onItemClick && 'cursor-pointer hover:bg-muted/60',
                )}
                onClick={() => onItemClick?.(item)}
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                  {item.code}
                </Badge>
                <span className="text-foreground truncate flex-1">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">{item.percentage}%</span>
                {onItemClick && (
                  <FileSearch className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
