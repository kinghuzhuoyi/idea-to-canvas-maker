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
import { Plus, GitBranch } from 'lucide-react';
import { toast } from 'sonner';

interface VersionTabProps {
  versions: StrategyVersion[];
  userRole: UserRole;
}

type ModalType = 'create' | 'publish' | 'rollback' | 'history' | 'terminate' | 'adjustTraffic' | 'fullPublish' | 'rollbackGrayscale' | null;

export function VersionTab({ versions, userRole }: VersionTabProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedVersion, setSelectedVersion] = useState<StrategyVersion | null>(null);
  const [newVersionNumber, setNewVersionNumber] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [trafficRatio, setTrafficRatio] = useState([20]);

  const canCreate = userRole === 'admin' || userRole === 'editor';

  const handleCreateVersion = () => {
    if (!newVersionNumber.trim()) {
      toast.error('请输入版本号');
      return;
    }
    toast.success(`版本 ${newVersionNumber} 创建成功`);
    setModalType(null);
    setNewVersionNumber('');
    setNewVersionDesc('');
  };

  const handlePublish = () => {
    if (selectedVersion) {
      toast.success(`版本 ${selectedVersion.versionNumber} 已提交发布`);
      setModalType(null);
      setSelectedVersion(null);
    }
  };

  const handleRollback = () => {
    if (selectedVersion) {
      toast.success(`已回滚到版本 ${selectedVersion.versionNumber}`);
      setModalType(null);
      setSelectedVersion(null);
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

  const handleRefreshApproval = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 审批状态已刷新`);
  };

  const handleRefreshGrayscale = (version: StrategyVersion) => {
    toast.success(`版本 ${version.versionNumber} 灰度状态已刷新`);
  };

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
          />
        </CardContent>
      </Card>

      {/* 新建版本弹窗 */}
      <Dialog open={modalType === 'create'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建版本</DialogTitle>
            <DialogDescription>
              创建一个新的策略版本，新版本将自动保存为草稿状态。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="version">版本号</Label>
              <Input
                id="version"
                placeholder="例如: v2.2.0"
                value={newVersionNumber}
                onChange={(e) => setNewVersionNumber(e.target.value)}
              />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button onClick={handleCreateVersion}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发布确认弹窗 */}
      <Dialog open={modalType === 'publish'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发布版本</DialogTitle>
            <DialogDescription>
              确定要发布版本 {selectedVersion?.versionNumber} 吗？发布后将进入审批流程。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button onClick={handlePublish}>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 回滚确认弹窗 */}
      <Dialog open={modalType === 'rollback'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>回滚版本</DialogTitle>
            <DialogDescription>
              确定要回滚到版本 {selectedVersion?.versionNumber} 吗？当前生效版本将被替换。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
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

      {/* 调整流量弹窗 */}
      <Dialog open={modalType === 'adjustTraffic'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>调整灰度流量</DialogTitle>
            <DialogDescription>
              调整版本 {selectedVersion?.versionNumber} 的灰度流量比例。
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">灰度流量比例</span>
              <span className="text-lg font-semibold text-primary">{trafficRatio[0]}%</span>
            </div>
            <Slider
              value={trafficRatio}
              onValueChange={setTrafficRatio}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button onClick={handleFullPublish}>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 灰度回滚弹窗 */}
      <Dialog open={modalType === 'rollbackGrayscale'} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>回滚灰度版本</DialogTitle>
            <DialogDescription>
              确定要回滚灰度版本 {selectedVersion?.versionNumber} 吗？回滚后将恢复到当前生效版本。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleRollbackGrayscale}>
              确认回滚
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
