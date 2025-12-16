import { Project, UserRole } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Folder, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  onLeave?: () => void;
}

const roleLabels: Record<UserRole, string> = {
  admin: '管理者',
  editor: '编辑者',
  viewer: '查看者',
  pending: '申请中',
};

export function ProjectCard({ project, isSelected, onClick, onLeave }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl cursor-pointer transition-all duration-300',
        'border',
        isSelected
          ? 'bg-primary/5 border-primary/30 shadow-[0_2px_12px_hsl(199_89%_48%/0.12)]'
          : 'bg-card border-transparent hover:bg-accent/40 hover:border-border/60 hover:shadow-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
          isSelected ? 'bg-primary/20' : 'bg-muted'
        )}>
          <Folder className={cn(
            'h-5 w-5',
            isSelected ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-medium truncate',
              isSelected ? 'text-foreground' : 'text-foreground/90'
            )}>
              {project.name}
            </h3>
          </div>
          
          <Badge variant={project.userRole} className="text-[10px]">
            {roleLabels[project.userRole]}
          </Badge>
        </div>
      </div>

      {/* 悬浮退出按钮 - 非管理者可见 */}
      {project.userRole !== 'admin' && onLeave && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onLeave();
          }}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      )}

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </div>
  );
}
