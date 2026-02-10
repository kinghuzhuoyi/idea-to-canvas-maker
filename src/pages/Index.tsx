import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ProjectSidebar } from '@/components/project/ProjectSidebar';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { PendingProjectDetail } from '@/components/project/PendingProjectDetail';
import { EmptyProjectState } from '@/components/project/EmptyProjectState';
import { MemberManagementModal } from '@/components/project/MemberManagementModal';
import { JoinProjectModal } from '@/components/project/JoinProjectModal';
import { LeaveProjectDialog } from '@/components/project/LeaveProjectDialog';
import { UpgradeRoleModal } from '@/components/project/UpgradeRoleModal';
import { WithdrawConfirmDialog } from '@/components/project/WithdrawConfirmDialog';
import { CreateStrategyModal } from '@/components/project/CreateStrategyModal';
import { mockProjects, mockStrategies, mockMembers } from '@/data/mockData';
import { Strategy } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

type WithdrawType = 'application' | 'upgrade';

const Index = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [projectToLeave, setProjectToLeave] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawType, setWithdrawType] = useState<WithdrawType | null>(null);
  const [createStrategyOpen, setCreateStrategyOpen] = useState(false);
  const [localStrategies, setLocalStrategies] = useState<Record<string, Strategy[]>>(mockStrategies);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);
  const strategies = selectedProjectId ? localStrategies[selectedProjectId] || [] : [];
  const members = selectedProjectId ? mockMembers[selectedProjectId] || [] : [];

  const handleJoinProject = (code: string, reason: string) => {
    toast({
      title: '申请已提交',
      description: `您的加入申请已发送，请等待项目管理员审批。`,
    });
  };

  const handleLeaveProject = (projectId: string) => {
    setProjectToLeave(projectId);
    setLeaveDialogOpen(true);
  };

  const confirmLeaveProject = () => {
    if (projectToLeave) {
      toast({
        title: '已退出项目',
        description: '您已成功退出该项目。',
      });
      if (selectedProjectId === projectToLeave) {
        setSelectedProjectId(null);
      }
    }
    setLeaveDialogOpen(false);
    setProjectToLeave(null);
  };

  const handleWithdrawApplication = () => {
    setWithdrawType('application');
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawUpgrade = () => {
    setWithdrawType('upgrade');
    setWithdrawDialogOpen(true);
  };

  const confirmWithdraw = () => {
    if (withdrawType === 'application') {
      toast({
        title: '申请已撤回',
        description: '您的项目加入申请已成功撤回。',
      });
      setSelectedProjectId(null);
    } else if (withdrawType === 'upgrade') {
      toast({
        title: '申请已撤回',
        description: '您的权限升级申请已成功撤回。',
      });
    }
    setWithdrawDialogOpen(false);
    setWithdrawType(null);
  };

  const handleUpgradeRole = (reason: string) => {
    toast({
      title: '升级申请已提交',
      description: '您的权限升级申请已发送，请等待管理员审批。',
    });
  };

  const handleCreateStrategy = (data: { code: string; name: string; description: string }) => {
    if (!selectedProjectId) return;
    const newStrategy: Strategy = {
      id: `s-new-${Date.now()}`,
      code: data.code,
      name: data.name,
      description: data.description,
      updatedAt: new Date().toISOString().split('T')[0],
      referenced: false,
      projectId: selectedProjectId,
      publishStatus: 'none',
      metrics: { todayCalls: 0, errorRate: 0 },
    };
    setLocalStrategies(prev => ({
      ...prev,
      [selectedProjectId]: [...(prev[selectedProjectId] || []), newStrategy],
    }));
    setCreateStrategyOpen(false);
    toast({
      title: '策略创建成功',
      description: `策略「${data.name}」已创建，正在跳转到详情页...`,
    });
    navigate(`/project/${selectedProjectId}/strategy/${newStrategy.id}`);
  };

  const projectToLeaveName = projectToLeave 
    ? mockProjects.find(p => p.id === projectToLeave)?.name || ''
    : '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar
          projects={mockProjects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onJoinProject={() => setJoinModalOpen(true)}
          onLeaveProject={handleLeaveProject}
        />

        <main className="flex-1 overflow-hidden bg-background">
          {selectedProject ? (
            selectedProject.userRole === 'pending' ? (
              <PendingProjectDetail
                project={selectedProject}
                onWithdraw={handleWithdrawApplication}
              />
            ) : (
              <ProjectDetail
                project={selectedProject}
                strategies={strategies}
                onMemberClick={() => setMemberModalOpen(true)}
                onCreateStrategy={() => setCreateStrategyOpen(true)}
                onUpgradeRole={() => setUpgradeModalOpen(true)}
                onWithdrawUpgrade={handleWithdrawUpgrade}
              />
            )
          ) : (
            <EmptyProjectState />
          )}
        </main>
      </div>

      {/* 成员管理弹窗 */}
      {selectedProject && (
        <MemberManagementModal
          open={memberModalOpen}
          onOpenChange={setMemberModalOpen}
          members={members}
          currentUserRole={selectedProject.userRole}
          projectName={selectedProject.name}
        />
      )}

      {/* 加入项目弹窗 */}
      <JoinProjectModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        onSubmit={handleJoinProject}
      />

      {/* 退出项目确认 */}
      <LeaveProjectDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        projectName={projectToLeaveName}
        onConfirm={confirmLeaveProject}
      />

      {/* 权限升级申请弹窗 */}
      {selectedProject && (
        <UpgradeRoleModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          projectName={selectedProject.name}
          onSubmit={handleUpgradeRole}
        />
      )}

      {/* 撤回申请确认弹窗 */}
      <WithdrawConfirmDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        type={withdrawType}
        projectName={selectedProject?.name || ''}
        onConfirm={confirmWithdraw}
      />

      {/* 新建策略弹窗 */}
      <CreateStrategyModal
        open={createStrategyOpen}
        onOpenChange={setCreateStrategyOpen}
        onSubmit={handleCreateStrategy}
      />
    </div>
  );
};

export default Index;
