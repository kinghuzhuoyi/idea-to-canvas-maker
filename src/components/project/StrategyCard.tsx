import { Strategy } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Calendar, Hash } from 'lucide-react';
import { UserRole } from '@/types/project';

interface StrategyCardProps {
  strategy: Strategy;
  userRole: UserRole;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function StrategyCard({ strategy, userRole, onView, onEdit, onDelete }: StrategyCardProps) {
  const canEdit = userRole === 'admin' || userRole === 'editor';
  const canDelete = userRole === 'admin';

  return (
    <div className="group card-elevated p-5 animate-slide-up hover:border-primary/20">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{strategy.code}</span>
            </div>
            <Badge variant={strategy.referenced ? 'referenced' : 'unreferenced'}>
              {strategy.referenced ? '引用中' : '未引用'}
            </Badge>
          </div>
          <h4 className="font-medium text-foreground mb-1.5 truncate">
            {strategy.name}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {strategy.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>更新于 {strategy.updatedAt}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          {canEdit && onEdit && (
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {canDelete && onDelete && (
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={onDelete}
              className="hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
