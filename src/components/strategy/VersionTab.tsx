import { useState } from 'react';
import { StrategyVersion, UserRole } from '@/types/project';
import { VersionTable } from './VersionTable';
import { VersionStatusCards } from './VersionStatusCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle2,
  Info,
  Rocket,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { ReleasePipeline } from './ReleasePipeline';

interface VersionTabProps {
  versions: StrategyVersion[];
  userRole: UserRole;
}

type ModalType = 'create' | 'publish' | 'rollback' | 'history' | 'terminate' | 'adjustTraffic' | 'fullPublish' | 'rollbackGrayscale' | 'delete' | null;
type PublishType = 'direct' | 'grayscale';

export function VersionTab({ versions, userRole }: VersionTabProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedVersion, setSelectedVersion] = useState<StrategyVersion | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<StrategyVersion[]>([]);
  
  // Create version form state
  const [newVersionNumber, setNewVersionNumber] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [baseVersion, setBaseVersion] = useState<string>('');
  const [editAfterCreate, setEditAfterCreate] = useState(false);
  
  // Publish form state
  const [publishType, setPublishType] = useState<PublishType>('direct');
  const [initialTrafficRatio, setInitialTrafficRatio] = useState([10]);
  const [publishNote, setPublishNote] = useState('');
  
  // Traffic adjustment state
  const [trafficRatio, setTrafficRatio] = useState([20]);
  const [adjustReason, setAdjustReason] = useState('');
  
  // Rollback state
  const [rollbackReason, setRollbackReason] = useState('');
  const [keepGrayscale, setKeepGrayscale] = useState(false);

  const canCreate = userRole === 'admin' || userRole === 'editor';
  const effectiveVersion = versions.find(v => v.status === 'effective');

  // Version number validation
  const isValidVersionNumber = (version: string) => {
    return /^v\d+\.\d+\.\d+$/.test(version);
  };

  const resetForms = () => {
    setNewVersionNumber('');
    setNewVersionDesc('');
    setBaseVersion('');
    setEditAfterCreate(false);
    setPublishType('direct');
    setInitialTrafficRatio([10]);
    setPublishNote('');
    setTrafficRatio([20]);
    setAdjustReason('');
    setRollbackReason('');
    setKeepGrayscale(false);
  };

  const handleCreateVersion = () => {
    if (!newVersionNumber.trim()) {
      toast.error('请输入版本号');
      return;
    }
    if (!isValidVersionNumber(newVersionNumber)) {
      toast.error('版本号格式不正确，请使用 vX.X.X 格式');
      return;
    }
    toast.success(`版本 ${newVersionNumber} 创建成功`);
    if (editAfterCreate) {
      toast.info('正在跳转到编辑页面...');
    }
    setModalType(null);
    resetForms();
  };

  const handlePublish = () => {
    if (selectedVersion) {
      if (publishType === 'grayscale') {
        toast.success(`版本 ${selectedVersion.versionNumber} 已提交灰度发布，初始流量 ${initialTrafficRatio[0]}%`);
      } else {
        toast.success(`版本 ${selectedVersion.versionNumber} 已提交发布审批`);
      }
      setModalType(null);
      setSelectedVersion(null);
      resetForms();
    }
  };

  const handleRollback = () => {
    if (selectedVersion) {
      toast.success(`已回滚到版本 ${selectedVersion.versionNumber}`);
      setModalType(null);
      setSelectedVersion(null);
      resetForms();
    }
  };

  const handleTerminateApproval = () => {
    if (selectedVersion) {
      toast.success(`版本 ${selectedVersion.versionNumber} 审批已终止`);
      setModalType(null);
      setSelectedVersion(null);
    }
  };

  const handleAdjustTraffic = () => {
    if (selectedVersion) {
      toast.success(`灰度流量已调整为 ${trafficRatio[0]}%`);
      setModalType(null);
      setSelectedVersion(null);
      resetForms();
    }
  };

  const handleFullPublish = () => {
    if (selectedVersion) {
      toast.success(`版本 ${selectedVersion.versionNumber} 已全量发布`);
      setModalType(null);
      setSelectedVersion(null);
    }
  };

  const handleRollbackGrayscale = () => {
    if (selectedVersion) {
      toast.success(`灰度版本 ${selectedVersion.versionNumber} 已回滚`);
      setModalType(null);
      setSelectedVersion(null);
      resetForms();
    }
  };

  const handleDeleteVersions = () => {
    if (selectedVersions.length > 0) {
      toast.success(`已删除 ${selectedVersions.length} 个草稿版本`);
      setModalType(null);
      setSelectedVersions([]);
    }
  };

  const handleCopy = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 已复制`);
  };

  const handleView = (version: StrategyVersion) => {
    toast.info(`查看版本 ${version.versionNumber} 详情`);
  };

  const handleExport = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 已导出`);
  };

  const handleEdit = (version: StrategyVersion) => {
    toast.info(`正在编辑版本 ${version.versionNumber}...`);
  };

  const handleRefreshApproval = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 审批状态已刷新`);
  };

  const handleRefreshGrayscale = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 灰度状态已刷新`);
  };

  // Traffic quick select buttons
  const trafficPresets = [10, 25, 50, 75, 100];

  return (
    <div className="space-y-6">
      {/* Version Status Cards */}
      <VersionStatusCards
        versions={versions}
        userRole={userRole}
        onRefreshApproval={handleRefreshApproval}
        onTerminateApproval={(v) => {
          setSelectedVersion(v);
          setModalType('terminate');
        }}
        onRefreshGrayscale={handleRefreshGrayscale}
        onAdjustTraffic={(v) => {
          setSelectedVersion(v);
          setTrafficRatio([v.grayscaleInfo?.trafficRatio || 20]);
          setModalType('adjustTraffic');
        }}
        onFullPublish={(v) => {
          setSelectedVersion(v);
          setModalType('fullPublish');
        }}
        onRollbackGrayscale={(v) => {
          setSelectedVersion(v);
          setModalType('rollbackGrayscale');
        }}
      />

      {/* Version List Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              版本列表
            </CardTitle>
            {canCreate && (
              <Button size="sm" onClick={() => setModalType('create')}>
                <Plus className="h-4 w-4 mr-1" />
                新建版本
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <VersionTable
            versions={versions}
            userRole={userRole}
            onPublish={(v) => {
              setSelectedVersion(v);
              setModalType('publish');
            }}
            onCopy={handleCopy}
            onRollback={(v) => {
              setSelectedVersion(v);
              setModalType('rollback');
            }}
            onViewHistory={(v) => {
              setSelectedVersion(v);
              setModalType('history');
            }}
            onView={handleView}
            onExport={handleExport}
            onDelete={(v) => {
              setSelectedVersions(v);
              setModalType('delete');
            }}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      {/* 新建版本弹窗 - Enhanced */}
      <Dialog open={modalType === 'create'} onOpenChange={() => { setModalType(null); resetForms(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新建版本</DialogTitle>
            <DialogDescription>
              创建一个新的策略版本，新版本将自动保存为草稿状态。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="baseVersion">基于版本（可选）</Label>
              <Select value={baseVersion} onValueChange={setBaseVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="从头创建" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">从头创建</SelectItem>
                  {versions.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.versionNumber} - {v.description.slice(0, 20)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">
                版本号 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="version"
                placeholder="例如: v2.2.0"
                value={newVersionNumber}
                onChange={(e) => setNewVersionNumber(e.target.value)}
                className={newVersionNumber && !isValidVersionNumber(newVersionNumber) ? 'border-destructive' : ''}
              />
              {newVersionNumber && !isValidVersionNumber(newVersionNumber) && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  请使用 vX.X.X 格式（如 v1.0.0）
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">版本描述</Label>
              <Textarea
                id="description"
                placeholder="描述本版本的主要变更内容..."
                value={newVersionDesc}
                onChange={(e) => setNewVersionDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="editAfter" 
                checked={editAfterCreate}
                onCheckedChange={(checked) => setEditAfterCreate(!!checked)}
              />
              <Label htmlFor="editAfter" className="text-sm font-normal cursor-pointer">
                创建后立即编辑规则
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModalType(null); resetForms(); }}>
              取消
            </Button>
            <Button onClick={handleCreateVersion} disabled={!newVersionNumber || !isValidVersionNumber(newVersionNumber)}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalType === 'publish'} onOpenChange={() => { setModalType(null); resetForms(); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              发布流水线
            </DialogTitle>
            <DialogDescription>
              发布版本 {selectedVersion?.versionNumber}，请按流程从左至右完成各模块校验。
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <ReleasePipeline
              versionNumber={selectedVersion?.versionNumber}
              onGrayscalePublish={() => {
                setTimeout(() => {
                  setModalType(null);
                  setSelectedVersion(null);
                  resetForms();
                }, 800);
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModalType(null); resetForms(); }}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 回滚确认弹窗 - Enhanced */}
      <Dialog open={modalType === 'rollback'} onOpenChange={() => { setModalType(null); resetForms(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              回滚版本
            </DialogTitle>
            <DialogDescription>
              确定要回滚到版本 {selectedVersion?.versionNumber} 吗？
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Version comparison */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">当前生效</p>
                <p className="font-mono font-medium">{effectiveVersion?.versionNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">回滚目标</p>
                <p className="font-mono font-medium text-primary">{selectedVersion?.versionNumber}</p>
              </div>
            </div>

            {/* Risk warning */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>回滚操作将立即替换当前生效版本，请确认已评估影响。</p>
            </div>

            {/* Rollback reason */}
            <div className="space-y-2">
              <Label htmlFor="rollbackReason">回滚原因（可选）</Label>
              <Textarea
                id="rollbackReason"
                placeholder="请说明回滚原因..."
                value={rollbackReason}
                onChange={(e) => setRollbackReason(e.target.value)}
                rows={2}
              />
            </div>

            {/* Keep grayscale option */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="keepGrayscale" 
                checked={keepGrayscale}
                onCheckedChange={(checked) => setKeepGrayscale(!!checked)}
              />
              <Label htmlFor="keepGrayscale" className="text-sm font-normal cursor-pointer">
                回滚后保留灰度版本
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModalType(null); resetForms(); }}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleRollback}>
              确认回滚
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 终止审批弹窗 */}
      <Dialog open={modalType === 'terminate'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>终止审批</DialogTitle>
            <DialogDescription>
              确定要终止版本 {selectedVersion?.versionNumber} 的审批流程吗？终止后需要重新发起审批。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleTerminateApproval}>
              确认终止
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 调整流量弹窗 - Enhanced */}
      <Dialog open={modalType === 'adjustTraffic'} onOpenChange={() => { setModalType(null); resetForms(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>调整灰度流量</DialogTitle>
            <DialogDescription>
              调整版本 {selectedVersion?.versionNumber} 的灰度流量比例。
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            {/* Current vs New traffic */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">当前流量</p>
                <p className="text-xl font-bold">{selectedVersion?.grayscaleInfo?.trafficRatio || 0}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">调整后流量</p>
                <p className="text-xl font-bold text-primary">{trafficRatio[0]}%</p>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <Slider
                value={trafficRatio}
                onValueChange={setTrafficRatio}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex gap-2 justify-center">
                {trafficPresets.map(preset => (
                  <Button
                    key={preset}
                    variant={trafficRatio[0] === preset ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTrafficRatio([preset])}
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>

            {/* Adjust reason */}
            <div className="space-y-2">
              <Label htmlFor="adjustReason">调整原因（可选）</Label>
              <Textarea
                id="adjustReason"
                placeholder="请说明调整原因..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModalType(null); resetForms(); }}>
              取消
            </Button>
            <Button onClick={handleAdjustTraffic}>确认调整</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 全量发布弹窗 */}
      <Dialog open={modalType === 'fullPublish'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>全量发布</DialogTitle>
            <DialogDescription>
              确定要将版本 {selectedVersion?.versionNumber} 全量发布吗？灰度版本将正式上线，替换当前生效版本。
            </DialogDescription>
          </DialogHeader>
          {selectedVersion?.grayscaleInfo && (
            <div className="p-4 rounded-lg bg-emerald-500/10 space-y-2">
              <h4 className="text-sm font-medium text-emerald-700">灰度运行指标</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">调用量</span>
                  <p className="font-medium">{selectedVersion.grayscaleInfo.metrics.callCount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">通过率</span>
                  <p className="font-medium text-emerald-600">{selectedVersion.grayscaleInfo.metrics.passRate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">异常率</span>
                  <p className="font-medium text-amber-600">{selectedVersion.grayscaleInfo.metrics.errorRate}%</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button onClick={handleFullPublish}>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 灰度回滚弹窗 */}
      <Dialog open={modalType === 'rollbackGrayscale'} onOpenChange={() => { setModalType(null); resetForms(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              回滚灰度版本
            </DialogTitle>
            <DialogDescription>
              确定要回滚灰度版本 {selectedVersion?.versionNumber} 吗？回滚后将恢复到当前生效版本。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>回滚后，当前灰度流量将全部切换到生效版本。</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grayscaleRollbackReason">回滚原因（可选）</Label>
              <Textarea
                id="grayscaleRollbackReason"
                placeholder="请说明回滚原因..."
                value={rollbackReason}
                onChange={(e) => setRollbackReason(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setModalType(null); resetForms(); }}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleRollbackGrayscale}>
              确认回滚
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={modalType === 'delete'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              删除草稿版本
            </DialogTitle>
            <DialogDescription>
              确定要删除以下 {selectedVersions.length} 个草稿版本吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {selectedVersions.map(v => (
                <div key={v.id} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <span className="font-mono text-sm">{v.versionNumber}</span>
                  <span className="text-sm text-muted-foreground truncate">{v.description}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteVersions}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 修改历史弹窗 */}
      <Dialog open={modalType === 'history'} onOpenChange={() => setModalType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>修改历史 - {selectedVersion?.versionNumber}</DialogTitle>
            <DialogDescription>
              查看版本 {selectedVersion?.versionNumber} 的所有修改记录。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {[
                { time: '2024-12-15 14:30', user: '张三', change: '更新权重配置参数' },
                { time: '2024-12-14 10:20', user: '李四', change: '修复边界条件判断逻辑' },
                { time: '2024-12-13 16:00', user: '张三', change: '新增多维度特征支持' },
              ].map((record, index) => (
                <div key={index} className="flex items-start gap-4 text-sm border-b pb-3 last:border-0">
                  <span className="text-muted-foreground w-36 flex-shrink-0">{record.time}</span>
                  <span className="font-medium w-16">{record.user}</span>
                  <span className="text-muted-foreground">{record.change}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
