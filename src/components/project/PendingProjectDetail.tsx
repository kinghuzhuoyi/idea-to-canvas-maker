import { Project, Member } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  Circle,
  XCircle,
  Undo2,
  Loader2,
  Mail,
  Shield,
} from 'lucide-react';

interface PendingProjectDetailProps {
  project: Project;
  admins: Member[];
  onWithdraw: () => void;
}

const applicationSteps = [
  { id: 1, name: '提交申请', description: '您已提交加入项目的申请' },
  { id: 2, name: '管理员审核', description: '等待项目管理员审核您的申请' },
  { id: 3, name: '加入成功', description: '审核通过后即可访问项目内容' },
];

export function PendingProjectDetail({ project, admins, onWithdraw }: PendingProjectDetailProps) {
  const currentStep = 2; // 当前在管理员审核阶段

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 项目基本信息 */}
      <div className="p-6 border-b border-border animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <Badge variant="pending">申请中</Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>创建于 {project.createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>最后更新 {project.updatedAt}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.memberCount} 名成员</span>
          </div>
        </div>
      </div>

      {/* 申请进度区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* 申请信息卡片 */}
          <div className="card-elevated p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-warning animate-spin" />
              </div>
              <div>
                <h3 className="font-medium">申请审核中</h3>
                <p className="text-sm text-muted-foreground">
                  您的申请正在等待项目管理员审核
                </p>
              </div>
            </div>

            {project.applicationInfo && (
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">申请时间：</span>
                  <span>{project.applicationInfo.appliedAt}</span>
                </div>
                {project.applicationInfo.reason && (
                  <div className="flex items-start gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">申请理由：</span>
                    <span className="flex-1">{project.applicationInfo.reason}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 进度步骤 */}
          <div className="card-elevated p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h4 className="font-medium mb-6">申请进度</h4>
            <div className="relative">
              {applicationSteps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isPending = step.id > currentStep;

                return (
                  <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                    {/* 步骤指示器 */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-success text-success-foreground'
                            : isCurrent
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isCurrent ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      {/* 连接线 */}
                      {index < applicationSteps.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 transition-colors ${
                            isCompleted ? 'bg-success' : 'bg-border'
                          }`}
                        />
                      )}
                    </div>

                    {/* 步骤内容 */}
                    <div className="flex-1 pt-1">
                      <h5
                        className={`font-medium mb-1 ${
                          isPending ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {step.name}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 管理员信息卡片 */}
          {admins.length > 0 && (
            <div className="card-elevated p-6 mt-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">项目管理员</h4>
                <span className="text-xs text-muted-foreground">（审核长时间未通过？可直接联系管理员）</span>
              </div>
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {admin.name.slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-primary hover:text-primary"
                            onClick={() => window.open(`mailto:${admin.email}?subject=关于加入「${project.name}」项目的申请`, '_blank')}
                          >
                            <Mail className="h-4 w-4" />
                            联系
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>发送邮件给 {admin.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 撤回按钮 */}
          <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: '250ms' }}>
            <Button
              variant="outline"
              onClick={onWithdraw}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            >
              <Undo2 className="h-4 w-4 mr-2" />
              撤回申请
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}