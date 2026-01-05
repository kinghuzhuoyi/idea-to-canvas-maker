import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowUpCircle } from 'lucide-react';

interface UpgradeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onSubmit: (reason: string) => void;
}

export function UpgradeRoleModal({
  open,
  onOpenChange,
  projectName,
  onSubmit,
}: UpgradeRoleModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      onSubmit(reason);
      setReason('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>申请权限升级</DialogTitle>
          </div>
          <DialogDescription>
            您正在申请将在「{projectName}」中的角色从查看者升级为编辑者
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">申请理由（可选）</Label>
            <Textarea
              id="reason"
              placeholder="请简要说明您申请权限升级的原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <p>升级为编辑者后，您将获得以下权限：</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>创建和编辑策略</li>
              <li>修改策略状态</li>
              <li>导出策略数据</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '提交申请'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
