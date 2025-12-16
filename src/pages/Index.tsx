import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectSidebar } from '@/components/project/ProjectSidebar';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { EmptyProjectState } from '@/components/project/EmptyProjectState';
import { MemberManagementModal } from '@/components/project/MemberManagementModal';
import { JoinProjectModal } from '@/components/project/JoinProjectModal';
import { LeaveProjectDialog } from '@/components/project/LeaveProjectDialog';
import { mockProjects, mockStrategies, mockMembers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [projectToLeave, setProjectToLeave] = useState<string | null>(null);
  
  const { toast } = useToast();

  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);
  const strategies = selectedProjectId ? mockStrategies[selectedProjectId] || [] : [];
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
            <ProjectDetail
              project={selectedProject}
              strategies={strategies}
              onMemberClick={() => setMemberModalOpen(true)}
              onCreateStrategy={() => {
                toast({
                  title: '功能开发中',
                  description: '新建策略功能即将上线。',
                });
              }}
            />
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
    </div>
  );
};

export default Index;
