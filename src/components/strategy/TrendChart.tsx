import { MetricTrendPoint } from '@/types/project';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  data: MetricTrendPoint[];
  title: string;
  dataKey?: string;
  compareKey?: string;
  color?: string;
  compareColor?: string;
  unit?: string;
  showArea?: boolean;
  height?: number;
  className?: string;
}

export function TrendChart({
  data,
  title,
  dataKey = 'value',
  compareKey,
  color = 'hsl(var(--primary))',
  compareColor = 'hsl(var(--muted-foreground))',
  unit = '',
  showArea = false,
  height = 200,
  className,
}: TrendChartProps) {
  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <h4 className="text-sm font-medium mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }} 
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value}${unit}`, '']}
          />
          {compareKey && (
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => value === dataKey ? '当前' : '同期'}
            />
          )}
          {showArea ? (
            <>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              {compareKey && (
                <Line 
                  type="monotone" 
                  dataKey={compareKey} 
                  stroke={compareColor} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: compareColor, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
