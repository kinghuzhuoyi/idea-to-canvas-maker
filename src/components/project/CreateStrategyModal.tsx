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
import { FilePlus } from 'lucide-react';

interface CreateStrategyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { code: string; name: string; description: string }) => void;
}

export function CreateStrategyModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateStrategyModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = code.trim() && name.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
    });
    setCode('');
    setName('');
    setDescription('');
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setCode('');
      setName('');
      setDescription('');
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FilePlus className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>新建策略</DialogTitle>
          </div>
          <DialogDescription>
            填写策略基本信息，创建后将进入策略详情页面。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="strategy-code">
              策略编码 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="strategy-code"
              placeholder="例如：RC-009"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy-name">
              策略名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="strategy-name"
              placeholder="请输入策略名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy-desc">策略描述</Label>
            <Textarea
              id="strategy-desc"
              placeholder="请输入策略描述（选填）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            新建策略
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
