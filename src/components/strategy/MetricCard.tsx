import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  trend, 
  trendLabel,
  icon,
  variant = 'default',
  className 
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-emerald-50 dark:bg-emerald-950/20',
    warning: 'bg-amber-50 dark:bg-amber-950/20',
    danger: 'bg-red-50 dark:bg-red-950/20',
  };

  const valueStyles = {
    default: 'text-foreground',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return 'text-muted-foreground';
    // For error rate, lower is better
    if (title.includes('异常') || title.includes('错误')) {
      return trend < 0 ? 'text-emerald-600' : 'text-red-600';
    }
    return trend > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-all hover:shadow-md',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-2xl font-bold', valueStyles[variant])}>
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs', getTrendColor())}>
          {getTrendIcon()}
          <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
