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
import { LogOut } from 'lucide-react';

interface LeaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void;
}

export function LeaveProjectDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
}: LeaveProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-2">
            <LogOut className="h-6 w-6 text-destructive" />
          </div>
          <AlertDialogTitle>确认退出项目</AlertDialogTitle>
          <AlertDialogDescription>
            您确定要退出「{projectName}」吗？退出后将无法访问该项目的策略和数据，
            如需重新加入需要再次申请。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            确认退出
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
