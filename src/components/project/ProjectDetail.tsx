import { Project, Strategy, UserRole, Member } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StrategyList } from './StrategyList';
import { UpgradeProgressCard } from './UpgradeProgressCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Download,
  Settings,
  FileText,
  ArrowUpCircle,
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  strategies: Strategy[];
  admins: Member[];
  onMemberClick: () => void;
  onCreateStrategy?: () => void;
  onUpgradeRole?: () => void;
  onWithdrawUpgrade?: () => void;
}

const roleLabels: Record<UserRole, string> = {
  admin: '管理者',
  editor: '编辑者',
  viewer: '查看者',
  pending: '申请中',
};

export function ProjectDetail({
  project,
  strategies,
  admins,
  onMemberClick,
  onCreateStrategy,
  onUpgradeRole,
  onWithdrawUpgrade,
}: ProjectDetailProps) {
  const canCreate = project.userRole === 'admin' || project.userRole === 'editor';
  const isViewer = project.userRole === 'viewer';
  const hasUpgradeApplication = project.upgradeApplication?.status === 'pending';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 项目基本信息 */}
      <div className="p-6 border-b border-border animate-fade-in">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <Badge variant={project.userRole}>
                {roleLabels[project.userRole]}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {isViewer && !hasUpgradeApplication && onUpgradeRole && (
              <Button variant="outline" size="sm" onClick={onUpgradeRole}>
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                申请权限升级
              </Button>
            )}
            {project.userRole === 'admin' && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                项目设置
              </Button>
            )}
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
          <button
            onClick={onMemberClick}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>{project.memberCount} 名成员</span>
          </button>
        </div>

        {/* 权限升级进度卡片 */}
        {hasUpgradeApplication && project.upgradeApplication && onWithdrawUpgrade && (
          <div className="mt-4">
            <UpgradeProgressCard
              targetRole={project.upgradeApplication.targetRole}
              appliedAt={project.upgradeApplication.appliedAt}
              reason={project.upgradeApplication.reason}
              status={project.upgradeApplication.status}
              admins={admins}
              projectName={project.name}
              onWithdraw={onWithdrawUpgrade}
            />
          </div>
        )}
      </div>

      {/* 策略列表头部 */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">策略列表</h3>
          <Badge variant="secondary" className="text-xs">
            {strategies.length} 个策略
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          {canCreate && (
            <Button size="sm" onClick={onCreateStrategy} variant="glow">
              <Plus className="h-4 w-4 mr-2" />
              新建策略
            </Button>
          )}
        </div>
      </div>

      {/* 策略列表 */}
      <ScrollArea className="flex-1 p-6">
        <StrategyList
          strategies={strategies}
          userRole={project.userRole}
          onCreateStrategy={onCreateStrategy}
        />
      </ScrollArea>
    </div>
  );
}
