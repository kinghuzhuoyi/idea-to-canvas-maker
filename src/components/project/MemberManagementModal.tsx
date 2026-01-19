import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Member, UserRole, ProjectStats } from '@/types/project';
import {
  Users,
  Shield,
  Pencil,
  Eye,
  ChevronDown,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { AddMemberForm } from './AddMemberForm';
import { toast } from 'sonner';

interface MemberManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  currentUserRole: UserRole;
  projectName: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: '管理者',
  editor: '编辑者',
  viewer: '查看者',
  pending: '申请中',
};

const roleIcons: Record<UserRole, typeof Shield> = {
  admin: Shield,
  editor: Pencil,
  viewer: Eye,
  pending: Clock,
};

export function MemberManagementModal({
  open,
  onOpenChange,
  members,
  currentUserRole,
  projectName,
}: MemberManagementModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [localMembers, setLocalMembers] = useState(members);
  
  const canManage = currentUserRole === 'admin';

  const stats: ProjectStats = {
    totalMembers: localMembers.length,
    adminCount: localMembers.filter(m => m.role === 'admin').length,
    editorCount: localMembers.filter(m => m.role === 'editor').length,
    viewerCount: localMembers.filter(m => m.role === 'viewer').length,
  };

  const handleAddMember = (user: { id: string; name: string; email: string }, role: UserRole) => {
    const newMember: Member = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setLocalMembers(prev => [newMember, ...prev]);
    setShowAddForm(false);
    toast.success(`已添加成员 ${user.name}`, {
      description: `角色：${roleLabels[role]}`,
      icon: <CheckCircle2 className="h-4 w-4 text-success" />,
    });
  };

  const handleChangeRole = (memberId: string, newRole: UserRole) => {
    setLocalMembers(prev => 
      prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    const member = localMembers.find(m => m.id === memberId);
    if (member) {
      toast.success(`已更新 ${member.name} 的权限`, {
        description: `新角色：${roleLabels[newRole]}`,
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const member = localMembers.find(m => m.id === memberId);
    setLocalMembers(prev => prev.filter(m => m.id !== memberId));
    if (member) {
      toast.success(`已移除成员 ${member.name}`, {
        icon: <Trash2 className="h-4 w-4 text-destructive" />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            成员管理
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{projectName}</p>
        </DialogHeader>

        {/* 统计信息 */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">{stats.totalMembers}</div>
              <div className="text-xs text-muted-foreground">总成员</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary">{stats.adminCount}</div>
              <div className="text-xs text-muted-foreground">管理者</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-success">{stats.editorCount}</div>
              <div className="text-xs text-muted-foreground">编辑者</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-muted-foreground">{stats.viewerCount}</div>
              <div className="text-xs text-muted-foreground">查看者</div>
            </div>
          </div>
        </div>

        {/* 添加成员表单 */}
        {showAddForm && canManage && (
          <div className="px-4 pt-4">
            <AddMemberForm
              onAdd={handleAddMember}
              onCancel={() => setShowAddForm(false)}
              existingMemberEmails={localMembers.map(m => m.email)}
            />
          </div>
        )}

        {/* 成员列表 */}
        <ScrollArea className="flex-1 max-h-[400px]">
          <div className="p-4 space-y-2">
            {localMembers.map((member, index) => {
              const RoleIcon = roleIcons[member.role];
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{member.name}</span>
                      <Badge variant={member.role} className="text-[10px]">
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleLabels[member.role]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {member.joinedAt} 加入
                      </span>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            编辑权限
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleChangeRole(member.id, 'admin')}
                            disabled={member.role === 'admin'}
                            className={member.role === 'admin' ? 'bg-primary/10' : ''}
                          >
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            设为管理者
                            {member.role === 'admin' && <Check className="h-3 w-3 ml-auto text-primary" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleChangeRole(member.id, 'editor')}
                            disabled={member.role === 'editor'}
                            className={member.role === 'editor' ? 'bg-success/10' : ''}
                          >
                            <Pencil className="h-4 w-4 mr-2 text-success" />
                            设为编辑者
                            {member.role === 'editor' && <Check className="h-3 w-3 ml-auto text-success" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleChangeRole(member.id, 'viewer')}
                            disabled={member.role === 'viewer'}
                            className={member.role === 'viewer' ? 'bg-muted' : ''}
                          >
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                            设为查看者
                            {member.role === 'viewer' && <Check className="h-3 w-3 ml-auto" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* 底部操作区 */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            最近操作: 2024-12-15 张三添加李四为编辑者
          </div>
          {canManage && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                批量管理
              </Button>
              <Button 
                size="sm" 
                variant="glow"
                onClick={() => setShowAddForm(true)}
                disabled={showAddForm}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                添加成员
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
