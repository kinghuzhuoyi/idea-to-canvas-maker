import { useState } from 'react';
import { Search, Plus, FolderPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types/project';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onJoinProject: () => void;
  onLeaveProject: (id: string) => void;
}

export function ProjectSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onJoinProject,
  onLeaveProject,
}: ProjectSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-80 border-r border-border bg-sidebar flex flex-col h-full">
      {/* 搜索区域 */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-transparent focus:border-primary/50"
          />
        </div>
      </div>

      {/* 项目列表 */}
      <ScrollArea className="flex-1 p-2">
        {filteredProjects.length > 0 ? (
          <div className="space-y-1">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard
                  project={project}
                  isSelected={selectedProjectId === project.id}
                  onClick={() => onSelectProject(project.id)}
                  onLeave={() => onLeaveProject(project.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FolderPlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {searchQuery ? '未找到匹配的项目' : '暂无项目'}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {searchQuery ? '请尝试其他关键词' : '点击下方按钮加入项目'}
            </p>
          </div>
        )}
      </ScrollArea>

      {/* 底部操作区 */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={onJoinProject}
          variant="glow"
          className="w-full"
        >
          <Plus className="h-4 w-4" />
          加入项目
        </Button>
      </div>
    </aside>
  );
}
