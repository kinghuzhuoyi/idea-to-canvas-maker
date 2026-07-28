import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Hand,
  Eye,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type UnitStatus = 'pending' | 'running' | 'passed' | 'failed' | 'awaiting';
export type UnitKind = 'auto' | 'manual';

export interface PipelineLog {
  time: string;
  operator?: string;
  result: string;
  resultType: 'success' | 'error';
}

export interface PipelineUnit {
  id: string;
  name: string;
  kind: UnitKind;
  status: UnitStatus;
  /** Feedback message shown under unit info */
  feedback?: string;
  feedbackType?: 'success' | 'error' | 'info';
  /** Whether to show 查看详情 action when failed */
  hasDetail?: boolean;
  /** Manual-confirm button label (only for manual units) */
  manualLabel?: string;
  /** External "去测试" link label – when defined, show 刷新 + 去测试 buttons */
  testable?: boolean;
  log?: PipelineLog;
}

export interface PipelineStage {
  id: string;
  name: string;
  units: PipelineUnit[];
}

interface ReleasePipelineProps {
  versionNumber?: string;
  /** Controlled pipeline state */
  stages: PipelineStage[];
  onStagesChange: (stages: PipelineStage[]) => void;
  /** Grayscale traffic ratio (controlled) */
  grayscaleRatio?: number;
  onGrayscaleRatioChange?: (ratio: number) => void;
  /** Called when the final 灰度发布 button is clicked */
  onGrayscalePublish?: () => void;
}

const now = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const initialStages = (): PipelineStage[] => [
  {
    id: 'basic',
    name: '基础信息校验',
    units: [
      {
        id: 'canvas',
        name: '画布配置校验',
        kind: 'auto',
        status: 'passed',
        feedback: '通过',
        feedbackType: 'success',
        log: { time: '2026年6月8日 19:28:14', result: '通过', resultType: 'success' },
      },
      {
        id: 'resource',
        name: '引用资源有效性校验',
        kind: 'auto',
        status: 'passed',
        feedback: '通过',
        feedbackType: 'success',
        log: { time: '2026年6月8日 19:28:15', result: '通过', resultType: 'success' },
      },
      {
        id: 'param',
        name: '参数校验',
        kind: 'auto',
        status: 'passed',
        feedback: '通过',
        feedbackType: 'success',
        log: { time: '2026年6月8日 19:28:16', result: '通过', resultType: 'success' },
      },
      {
        id: 'changeConfirm',
        name: '版本变更确认',
        kind: 'manual',
        status: 'awaiting',
        feedback: '新增一个规则「高风险用户拦截」，下线一个模型「modelv10」',
        feedbackType: 'info',
        manualLabel: '确认无误',
        hasDetail: true,
      },
    ],
  },
  {
    id: 'test',
    name: '实验校验',
    units: [
      {
        id: 'singleTest',
        name: '单笔调试',
        kind: 'auto',
        status: 'pending',
        testable: true,
      },
      {
        id: 'batchTest',
        name: '批量测试',
        kind: 'auto',
        status: 'pending',
        testable: true,
      },
    ],
  },
  {
    id: 'release',
    name: '发布',
    units: [
      {
        id: 'approval',
        name: '发布审批',
        kind: 'manual',
        status: 'pending',
        manualLabel: '提交审批',
        hasDetail: true,
      },
      {
        id: 'grayscale',
        name: '灰度发布',
        kind: 'manual',
        status: 'pending',
        manualLabel: '灰度发布',
        hasDetail: true,
      },
    ],
  },
];

export const createInitialPipeline = initialStages;

const statusBadge = (status: UnitStatus) => {
  switch (status) {
    case 'passed':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          已通过
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          失败
        </Badge>
      );
    case 'running':
      return (
        <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/15 border-blue-500/20">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          执行中
        </Badge>
      );
    case 'awaiting':
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15 border-amber-500/20">
          <Hand className="h-3 w-3 mr-1" />
          待确认
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          待执行
        </Badge>
      );
  }
};

export function ReleasePipeline({
  versionNumber,
  stages,
  onStagesChange,
  grayscaleRatio = 10,
  onGrayscaleRatioChange,
  onGrayscalePublish,
}: ReleasePipelineProps) {
  const setStages = (updater: (prev: PipelineStage[]) => PipelineStage[]) =>
    onStagesChange(updater(stages));

  // helper – flatten units in execution order
  const orderedUnits = useMemo(
    () => stages.flatMap((s) => s.units.map((u) => ({ stageId: s.id, unit: u }))),
    [stages],
  );

  /** Advance: after a unit completes, set the next pending unit's status */
  const updateUnit = (stageId: string, unitId: string, patch: Partial<PipelineUnit>) => {
    setStages((prev) => {
      const next = prev.map((s) =>
        s.id === stageId
          ? { ...s, units: s.units.map((u) => (u.id === unitId ? { ...u, ...patch } : u)) }
          : s,
      );
      // activate next pending unit (set to running for auto, awaiting for manual)
      const flat = next.flatMap((s) => s.units.map((u) => ({ stageId: s.id, unit: u })));
      const idx = flat.findIndex((x) => x.unit.id === unitId);
      const nextItem = flat.slice(idx + 1).find((x) => x.unit.status === 'pending');
      if (nextItem && patch.status === 'passed') {
        nextItem.unit.status = nextItem.unit.kind === 'manual' ? 'awaiting' : 'pending';
      }
      return next;
    });
  };

  const handleManualConfirm = (stageId: string, unit: PipelineUnit) => {
    if (unit.id === 'approval') {
      updateUnit(stageId, unit.id, {
        status: 'running',
        feedback: '审批流程进行中，审批人：风控管理员',
        feedbackType: 'info',
        log: { time: now(), operator: '胡卓亦', result: '提交审批', resultType: 'success' },
      });
      toast.success(`版本 ${versionNumber ?? ''} 已提交发布审批`);
      // 模拟审批通过
      setTimeout(() => {
        updateUnit(stageId, unit.id, {
          status: 'passed',
          feedback: '审批通过',
          feedbackType: 'success',
          log: { time: now(), operator: '风控管理员', result: '审批通过', resultType: 'success' },
        });
      }, 2000);
      return;
    }
    if (unit.id === 'grayscale') {
      updateUnit(stageId, unit.id, {
        status: 'running',
        feedback: `灰度中，当前流量比例 ${grayscaleRatio}%`,
        feedbackType: 'info',
        log: { time: now(), operator: '胡卓亦', result: '已发布灰度', resultType: 'success' },
      });
      toast.success(`版本 ${versionNumber ?? ''} 已进入灰度，流量 ${grayscaleRatio}%`);
      onGrayscalePublish?.();
      return;
    }
    updateUnit(stageId, unit.id, {
      status: 'passed',
      log: { time: now(), operator: '胡卓亦', result: '确认无误', resultType: 'success' },
    });
    toast.success(`${unit.name} 已确认`);
  };


  const handleRefresh = (stageId: string, unit: PipelineUnit) => {
    updateUnit(stageId, unit.id, {
      status: 'passed',
      feedback: '通过',
      feedbackType: 'success',
      log: { time: now(), result: '通过', resultType: 'success' },
    });
    toast.success(`${unit.name} 校验通过`);
  };

  const handleGoTest = (unit: PipelineUnit) => {
    toast.info(`即将跳转到${unit.name}页面...`);
  };

  const handleViewDetail = (unit: PipelineUnit) => {
    toast.info(`查看 ${unit.name} 详情`);
  };

  // Determine the "current" active unit for progress styling
  const activeUnitId = useMemo(() => {
    const item = orderedUnits.find(
      (x) => x.unit.status === 'awaiting' || x.unit.status === 'running' || x.unit.status === 'failed',
    );
    if (item) return item.unit.id;
    // fallback: first pending
    return orderedUnits.find((x) => x.unit.status === 'pending')?.unit.id;
  }, [orderedUnits]);

  // Stage status derived from units
  const stageStatus = (stage: PipelineStage): UnitStatus => {
    if (stage.units.every((u) => u.status === 'passed')) return 'passed';
    if (stage.units.some((u) => u.status === 'failed')) return 'failed';
    if (stage.units.some((u) => u.status === 'awaiting' || u.status === 'running')) return 'running';
    if (stage.units.some((u) => u.status === 'passed')) return 'running';
    return 'pending';
  };

  const stageHeaderClass = (status: UnitStatus) => {
    switch (status) {
      case 'passed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'running':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* Stage headers row */}
      <div className="flex items-center gap-2">
        {stages.map((stage, i) => {
          const st = stageStatus(stage);
          return (
            <div key={stage.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg border flex items-center justify-between gap-2',
                  stageHeaderClass(st),
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold border',
                      st === 'passed'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : st === 'failed'
                        ? 'bg-destructive text-white border-destructive'
                        : st === 'running'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background border-border',
                    )}
                  >
                    {st === 'passed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className="text-sm font-medium">{stage.name}</span>
                </div>
                <span className="text-xs">
                  {stage.units.filter((u) => u.status === 'passed').length}/{stage.units.length}
                </span>
              </div>
              {i < stages.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Stage columns */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
        {stages.map((stage) => (
          <div key={stage.id} className="space-y-3">
            {stage.units.map((unit) => {
              const isActive = unit.id === activeUnitId;
              const isPending = unit.status === 'pending';
              return (
                <div
                  key={unit.id}
                  className={cn(
                    'rounded-lg border bg-card p-3 space-y-2.5 transition-all',
                    isActive && 'border-primary/40 shadow-[var(--shadow-card)]',
                    unit.status === 'failed' && 'border-destructive/40',
                    unit.status === 'passed' && 'opacity-90',
                  )}
                >
                  {/* Basic info */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{unit.name}</span>
                      {unit.kind === 'manual' && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">
                          人工
                        </Badge>
                      )}
                    </div>
                    {statusBadge(unit.status)}
                  </div>

                  {/* Feedback */}
                  {unit.feedback && !isPending && (
                    <div
                      className={cn(
                        'text-xs rounded-md px-2.5 py-2 flex items-start gap-1.5',
                        unit.feedbackType === 'success' && 'bg-emerald-500/10 text-emerald-700',
                        unit.feedbackType === 'error' && 'bg-destructive/10 text-destructive',
                        unit.feedbackType === 'info' && 'bg-muted text-foreground',
                      )}
                    >
                      {unit.feedbackType === 'success' && <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />}
                      {unit.feedbackType === 'error' && <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />}
                      <span className="leading-relaxed">{unit.feedback}</span>
                    </div>
                  )}
                  {isPending && unit.testable && (
                    <div className="text-xs rounded-md px-2.5 py-2 bg-muted/60 text-muted-foreground">
                      未进行{unit.name}
                    </div>
                  )}

                  {/* 灰度比例调节 */}
                  {unit.id === 'grayscale' && (unit.status === 'awaiting' || unit.status === 'running') && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">灰度比例</span>
                        <span className="font-medium">{grayscaleRatio}%</span>
                      </div>
                      <Slider
                        value={[grayscaleRatio]}
                        min={1}
                        max={100}
                        step={1}
                        onValueChange={(v) => onGrayscaleRatioChange?.(v[0])}
                      />
                    </div>
                  )}

                  {/* 灰度运行中的操作 */}
                  {unit.id === 'grayscale' && unit.status === 'running' && (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleViewDetail(unit)}>
                        <Eye className="h-3 w-3 mr-1" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          updateUnit(stage.id, unit.id, {
                            status: 'passed',
                            feedback: '已全量发布',
                            feedbackType: 'success',
                            log: { time: now(), operator: '胡卓亦', result: '全量发布', resultType: 'success' },
                          });
                          toast.success(`版本 ${versionNumber ?? ''} 已全量发布`);
                        }}
                      >
                        全量发布
                      </Button>
                    </div>
                  )}

                  {/* Action buttons – only when reached */}
                  {!isPending && (
                    <div className="flex flex-wrap gap-2">
                      {unit.status === 'failed' && unit.hasDetail && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleViewDetail(unit)}>
                          <Eye className="h-3 w-3 mr-1" />
                          查看详情
                        </Button>
                      )}
                      {unit.status === 'awaiting' && unit.kind === 'manual' && (
                        <>
                          {unit.hasDetail && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleViewDetail(unit)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              查看详情
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleManualConfirm(stage.id, unit)}
                          >
                            {unit.id === 'grayscale' && <Rocket className="h-3 w-3 mr-1" />}
                            {unit.manualLabel ?? '确认'}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  {/* testable units (单笔/批量) show 刷新+去测试 once reached */}
                  {unit.testable && unit.status !== 'pending' && unit.status !== 'passed' && (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRefresh(stage.id, unit)}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        刷新
                      </Button>
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleGoTest(unit)}>
                        去测试
                      </Button>
                    </div>
                  )}

                  {/* Action log – render only if exists (no "动作日志" label, no empty placeholder) */}
                  {unit.log && (
                    <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground space-y-0.5">
                      <div>时间：{unit.log.time}</div>
                      {unit.log.operator && <div>操作人：{unit.log.operator}</div>}
                      <div className="flex items-center gap-1">
                        结果：
                        <span
                          className={cn(
                            'font-medium',
                            unit.log.resultType === 'success' ? 'text-emerald-600' : 'text-destructive',
                          )}
                        >
                          {unit.log.result}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
