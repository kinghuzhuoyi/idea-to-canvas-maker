import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FolderPlus, Search } from 'lucide-react';

interface JoinProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (projectCode: string, reason: string) => void;
}

export function JoinProjectModal({ open, onOpenChange, onSubmit }: JoinProjectModalProps) {
  const [projectCode, setProjectCode] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!projectCode.trim()) return;
    
    setIsSubmitting(true);
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(projectCode, reason);
    setIsSubmitting(false);
    setProjectCode('');
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <FolderPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>加入项目</DialogTitle>
          <DialogDescription>
            输入项目代码或搜索公开项目，提交加入申请
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectCode">项目代码</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="projectCode"
                placeholder="输入项目代码或名称搜索"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">申请理由（可选）</Label>
            <Textarea
              id="reason"
              placeholder="简要说明加入项目的原因..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!projectCode.trim() || isSubmitting}
            variant="glow"
          >
            {isSubmitting ? '提交中...' : '提交申请'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
