import { useState, useEffect, useCallback } from 'react';
import { CustomMetric } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomMetricCard } from './CustomMetricCard';
import { CustomMetricBuilder } from './CustomMetricBuilder';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CustomMetricsModuleProps {
  storageKey: string;
}

export function CustomMetricsModule({ storageKey }: CustomMetricsModuleProps) {
  const [metrics, setMetrics] = useState<CustomMetric[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomMetric | null>(null);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMetrics(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: CustomMetric[]) => {
      setMetrics(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [storageKey],
  );

  const handleSave = (m: CustomMetric) => {
    const exists = metrics.some((x) => x.id === m.id);
    persist(exists ? metrics.map((x) => (x.id === m.id ? m : x)) : [...metrics, m]);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    persist(metrics.filter((x) => x.id !== id));
    toast.success('指标已删除');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          自定义指标
          <span className="text-xs font-normal text-muted-foreground">
            从输出字段中挑选并加工
          </span>
        </h3>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />新建指标
        </Button>
      </div>

      {metrics.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              暂无自定义指标，点击「新建指标」从输出字段中挑选并定义分箱
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />新建第一个指标
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {metrics.map((m) => (
            <CustomMetricCard
              key={m.id}
              metric={m}
              onEdit={() => {
                setEditing(m);
                setOpen(true);
              }}
              onDelete={() => handleDelete(m.id)}
            />
          ))}
        </div>
      )}

      <CustomMetricBuilder
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        onSave={handleSave}
        initial={editing ?? undefined}
      />
    </div>
  );
}
