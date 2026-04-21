import { NodeVerdictItem } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NodeVerdictChartProps {
  data: NodeVerdictItem[];
}

export function NodeVerdictChart({ data }: NodeVerdictChartProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          节点通过率
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            共 {data.length} 个节点
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((node, idx) => {
            const rateColor =
              node.passRate >= 95
                ? 'text-emerald-600 dark:text-emerald-400'
                : node.passRate >= 90
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400';

            const barColor =
              node.passRate >= 95
                ? 'bg-emerald-500'
                : node.passRate >= 90
                ? 'bg-amber-500'
                : 'bg-red-500';

            return (
              <div key={node.nodeId} className="group">
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground w-6">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {node.nodeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-muted-foreground tabular-nums">
                      {node.passCount.toLocaleString()} / {node.total.toLocaleString()}
                    </span>
                    <span className={cn('font-semibold tabular-nums w-14 text-right', rateColor)}>
                      {node.passRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', barColor)}
                    style={{ width: `${node.passRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
