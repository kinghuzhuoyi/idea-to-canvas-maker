import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpCircle, Clock, CheckCircle, XCircle, Undo2 } from 'lucide-react';

interface UpgradeProgressCardProps {
  targetRole: 'editor' | 'admin';
  appliedAt: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  onWithdraw: () => void;
}

const roleLabels = {
  editor: '编辑者',
  admin: '管理者',
};

const steps = [
  { id: 1, label: '提交申请' },
  { id: 2, label: '管理员审核' },
  { id: 3, label: '权限升级' },
];

export function UpgradeProgressCard({
  targetRole,
  appliedAt,
  reason,
  status,
  onWithdraw,
}: UpgradeProgressCardProps) {
  const currentStep = status === 'pending' ? 2 : status === 'approved' ? 3 : 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">权限升级申请中</h4>
              <p className="text-sm text-muted-foreground">
                目标角色：{roleLabels[targetRole]}
              </p>
            </div>
          </div>
          {status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onWithdraw}
              className="text-muted-foreground hover:text-destructive"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              撤回申请
            </Button>
          )}
        </div>

        {/* 进度步骤 */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isRejected = status === 'rejected' && step.id === 2;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isRejected
                        ? 'bg-destructive text-destructive-foreground'
                        : isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isRejected ? (
                      <XCircle className="h-4 w-4" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      isRejected
                        ? 'text-destructive'
                        : isCompleted || isCurrent
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {isRejected ? '已拒绝' : step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* 申请信息 */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>申请时间：{appliedAt}</p>
          {reason && <p>申请理由：{reason}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
