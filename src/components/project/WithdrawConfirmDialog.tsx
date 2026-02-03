import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Undo2 } from 'lucide-react';

type WithdrawType = 'application' | 'upgrade';

interface WithdrawConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: WithdrawType | null;
  projectName: string;
  onConfirm: () => void;
}

export function WithdrawConfirmDialog({
  open,
  onOpenChange,
  type,
  projectName,
  onConfirm,
}: WithdrawConfirmDialogProps) {
  const getDescription = () => {
    if (type === 'application') {
      return `您确定要撤回加入「${projectName}」的申请吗？撤回后如需重新加入需要再次提交申请。`;
    }
    return '您确定要撤回权限升级申请吗？撤回后如需升级权限需要重新提交申请。';
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-2">
            <Undo2 className="h-6 w-6 text-warning" />
          </div>
          <AlertDialogTitle>确认撤回申请</AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            确认撤回
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
