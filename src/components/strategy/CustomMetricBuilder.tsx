import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CustomMetric,
  OutputField,
  BinDefinition,
  CustomMetricChartType,
} from '@/types/project';
import { mockOutputFields } from '@/data/mockMonitoringData';
import { Plus, Trash2, Search, PieChart as PieIcon, BarChart3, Activity, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CustomMetricBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (metric: CustomMetric) => void;
  initial?: CustomMetric;
}

const chartTypeOptions: {
  value: CustomMetricChartType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  { value: 'pie', label: '累计饼图', desc: '查看各分箱占比', icon: <PieIcon className="h-4 w-4" /> },
  { value: 'rankBar', label: '累计柱形排序', desc: '按数量排序展示', icon: <BarChart3 className="h-4 w-4" /> },
  { value: 'trendBar', label: '时间趋势分布', desc: '按时间堆叠展示', icon: <Activity className="h-4 w-4" /> },
];

export function CustomMetricBuilder({ open, onOpenChange, onSave, initial }: CustomMetricBuilderProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [search, setSearch] = useState('');
  const [field, setField] = useState<OutputField | null>(null);
  const [bins, setBins] = useState<BinDefinition>({});
  const [chartType, setChartType] = useState<CustomMetricChartType>('pie');

  useEffect(() => {
    if (open) {
      if (initial) {
        const f = mockOutputFields.find((x) => x.code === initial.fieldCode);
        setField(f || null);
        setBins(initial.bins);
        setChartType(initial.chartType);
        setStep(2);
      } else {
        setStep(1);
        setField(null);
        setBins({});
        setChartType('pie');
        setSearch('');
      }
    }
  }, [open, initial]);

  const filteredFields = mockOutputFields.filter(
    (f) =>
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelectField = (f: OutputField) => {
    setField(f);
    if (f.type === 'boolean') {
      setBins({
        enumMap: [
          { label: '是', values: ['true', '1', 'yes'] },
          { label: '否', values: ['false', '0', 'no'] },
        ],
      });
      setStep(3); // 布尔：跳过分箱
    } else if (f.type === 'string') {
      setBins({ enumMap: [] });
      setStep(3); // 字符串：跳过分箱
    } else {
      setBins({ ranges: [{ label: '区间1' }] });
      setStep(2);
    }
  };

  const handleSave = () => {
    if (!field) return;
    const metric: CustomMetric = {
      id: initial?.id ?? `cm_${Date.now()}`,
      fieldCode: field.code,
      fieldLabel: field.label,
      fieldType: field.type,
      bins,
      chartType,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    onSave(metric);
    toast.success(initial ? '指标已更新' : '自定义指标已创建');
    onOpenChange(false);
  };

  // 平均分箱（快速分箱）：开始 / 结束 / 箱数
  const [quickStart, setQuickStart] = useState<string>('0');
  const [quickEnd, setQuickEnd] = useState<string>('100');
  const [quickCount, setQuickCount] = useState<string>('5');

  const applyEqualBin = () => {
    const start = Number(quickStart);
    const end = Number(quickEnd);
    const count = Math.floor(Number(quickCount));
    if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(count)) {
      toast.error('请输入有效的开始、结束、箱数');
      return;
    }
    if (end <= start || count < 1 || count > 20) {
      toast.error('结束值需大于开始值，箱数需在 1~20 之间');
      return;
    }
    const stepVal = (end - start) / count;
    const isInt = field?.numberSubtype === 'integer';
    const fmt = (n: number) => (isInt ? Math.round(n).toString() : Number(n.toFixed(2)).toString());
    const ranges = Array.from({ length: count }, (_, i) => {
      const min = start + stepVal * i;
      const max = start + stepVal * (i + 1);
      return { label: `${fmt(min)}-${fmt(max)}`, min, max };
    });
    setBins({ ranges });
    toast.success(`已生成 ${count} 个平均分箱`);
  };

  // 分箱编辑 ----- 数值
  const updateRange = (idx: number, patch: Partial<{ label: string; min: number; max: number }>) => {
    const ranges = [...(bins.ranges ?? [])];
    ranges[idx] = { ...ranges[idx], ...patch } as any;
    setBins({ ranges });
  };
  const addRange = () => {
    const current = bins.ranges ?? [];
    if (current.length >= 20) {
      toast.error('最多支持 20 个分箱');
      return;
    }
    setBins({ ranges: [...current, { label: `区间${current.length + 1}` }] });
  };
  const removeRange = (idx: number) =>
    setBins({ ranges: (bins.ranges ?? []).filter((_, i) => i !== idx) });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{initial ? '编辑自定义指标' : '新建自定义指标'}</DialogTitle>
          <DialogDescription>
            从输出字段中挑选指标，定义分箱规则与展示形式
          </DialogDescription>
        </DialogHeader>

        {/* 步骤指示（非数值类型隐藏分箱步骤） */}
        <div className="flex items-center gap-2 text-xs">
          {([
            { n: 1, label: '选择字段' },
            ...(field && field.type !== 'number' ? [] : [{ n: 2, label: '分箱定义' }]),
            { n: 3, label: '展示形式' },
          ] as { n: number; label: string }[]).map((s, i, arr) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center font-medium',
                  step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {s.n}
              </div>
              <span className={step >= s.n ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {s.label}
              </span>
              {i < arr.length - 1 && <div className="w-6 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {step === 1 && (
            <div className="space-y-3 h-full flex flex-col">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索字段编码或中文名"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <ScrollArea className="flex-1 max-h-[420px] border rounded-md">
                <div className="divide-y">
                  {filteredFields.map((f) => (
                    <button
                      key={f.code}
                      type="button"
                      onClick={() => handleSelectField(f)}
                      className="w-full text-left p-3 hover:bg-muted/60 transition-colors flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{f.label}</span>
                          <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                            {f.code}
                          </Badge>
                        </div>
                        {f.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {f.description}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {f.type === 'number'
                          ? f.numberSubtype === 'decimal'
                            ? '小数'
                            : '整数'
                          : f.type === 'boolean'
                          ? '布尔'
                          : '字符串'}
                      </Badge>
                    </button>
                  ))}
                  {filteredFields.length === 0 && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      未找到匹配字段
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {step === 2 && field && (
            <ScrollArea className="h-[460px] pr-3">
              <div className="space-y-4">
                <div className="rounded-md border bg-muted/30 p-3 flex items-center gap-2">
                  <span className="font-medium text-sm">{field.label}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">{field.code}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    {field.type === 'number' ? '数值' : field.type === 'boolean' ? '布尔' : '字符串'}
                  </Badge>
                </div>

                {field.type === 'number' && (
                  <>
                    <div className="rounded-md border bg-muted/20 p-3 space-y-3">
                      <Label className="text-sm flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        快速分箱（平均分箱）
                      </Label>
                      <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">开始</Label>
                          <Input
                            type="number"
                            value={quickStart}
                            onChange={(e) => setQuickStart(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">结束</Label>
                          <Input
                            type="number"
                            value={quickEnd}
                            onChange={(e) => setQuickEnd(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">箱数</Label>
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            value={quickCount}
                            onChange={(e) => setQuickCount(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <Button type="button" size="sm" onClick={applyEqualBin} className="h-8">
                          生成
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        将 [开始, 结束) 平均切分为指定箱数{field.numberSubtype === 'integer' ? '（整数取整）' : ''}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">分箱区间</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={addRange} className="h-7">
                          <Plus className="h-3.5 w-3.5 mr-1" />添加区间
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(bins.ranges ?? []).map((r, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Input
                              placeholder="标签"
                              value={r.label}
                              onChange={(e) => updateRange(i, { label: e.target.value })}
                              className="h-8 w-32"
                            />
                            <Input
                              type="number"
                              placeholder="最小值"
                              value={r.min ?? ''}
                              onChange={(e) =>
                                updateRange(i, { min: e.target.value === '' ? undefined : Number(e.target.value) } as any)
                              }
                              className="h-8 flex-1"
                            />
                            <span className="text-xs text-muted-foreground">≤ x &lt;</span>
                            <Input
                              type="number"
                              placeholder="最大值"
                              value={r.max ?? ''}
                              onChange={(e) =>
                                updateRange(i, { max: e.target.value === '' ? undefined : Number(e.target.value) } as any)
                              }
                              className="h-8 flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRange(i)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label className="text-sm">选择展示形式</Label>
              <RadioGroup
                value={chartType}
                onValueChange={(v) => setChartType(v as CustomMetricChartType)}
                className="grid grid-cols-1 gap-2"
              >
                {chartTypeOptions.map((opt) => (
                  <label
                    key={opt.value}
                    htmlFor={`chart-${opt.value}`}
                    className={cn(
                      'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                      chartType === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50',
                    )}
                  >
                    <RadioGroupItem id={`chart-${opt.value}`} value={opt.value} />
                    <div className="text-primary">{opt.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => {
                // 非数值类型：从 step 3 直接回到 step 1
                if (step === 3 && field && field.type !== 'number') setStep(1);
                else setStep((s) => (s - 1) as 1 | 2 | 3);
              }}
            >
              上一步
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
          {step === 1 && <Button disabled>请选择字段</Button>}
          {step === 2 && (
            <Button onClick={() => setStep(3)} disabled={!field}>下一步</Button>
          )}
          {step === 3 && <Button onClick={handleSave}>保存指标</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
